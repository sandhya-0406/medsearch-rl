import cv2
import numpy as np

from torch.utils.data import Dataset
import torchvision.transforms as transforms


class ClassificationDataset(Dataset):

    """
    Base Dataset for all MedSearch-RL classification datasets.
    """

    def __init__(
            self,
            image_size=224,
            padding=0.20,
            min_crop_size=64,
            train=True
    ):

        super().__init__()

        self.image_size = image_size
        self.padding = padding
        self.min_crop_size = min_crop_size
        self.train = train

        self.samples = []

        self.transform = self.build_transforms()

        self.load_samples()

    ############################################################

    def load_samples(self):

        raise NotImplementedError

    ############################################################

    def __len__(self):

        return len(self.samples)

    ############################################################

    def crop_object(
            self,
            image,
            bbox
    ):

        xmin, ymin, xmax, ymax = bbox

        h, w = image.shape[:2]

        box_w = xmax - xmin
        box_h = ymax - ymin

        ########################################################
        # Padding
        ########################################################

        pad_x = int(box_w * self.padding)
        pad_y = int(box_h * self.padding)

        xmin -= pad_x
        xmax += pad_x

        ymin -= pad_y
        ymax += pad_y

        ########################################################
        # Square Crop
        ########################################################

        crop_w = xmax - xmin
        crop_h = ymax - ymin

        side = max(
            crop_w,
            crop_h,
            self.min_crop_size
        )

        cx = (xmin + xmax) // 2
        cy = (ymin + ymax) // 2

        xmin = cx - side // 2
        xmax = xmin + side

        ymin = cy - side // 2
        ymax = ymin + side

        ########################################################
        # Clip to image boundaries
        ########################################################

        xmin = max(0, xmin)
        ymin = max(0, ymin)

        xmax = min(w, xmax)
        ymax = min(h, ymax)

        crop = image[
            ymin:ymax,
            xmin:xmax
        ]

        ########################################################
        # Safety
        ########################################################

        if crop.size == 0:

            crop = np.zeros(

                (
                    self.image_size,
                    self.image_size,
                    3
                ),

                dtype=np.uint8

            )

        ########################################################
        # MRI grayscale → RGB
        ########################################################

        if len(crop.shape) == 2:

            crop = cv2.cvtColor(
                crop,
                cv2.COLOR_GRAY2RGB
            )

        elif crop.shape[2] == 1:

            crop = cv2.cvtColor(
                crop,
                cv2.COLOR_GRAY2RGB
            )

        return crop

    ############################################################

    def resize(
            self,
            image
    ):

        return cv2.resize(

            image,

            (
                self.image_size,
                self.image_size
            )

        )

    ############################################################

    def build_transforms(self):

        if self.train:

            return transforms.Compose([

                transforms.ToPILImage(),

                transforms.RandomHorizontalFlip(0.5),

                transforms.RandomRotation(10),

                transforms.ColorJitter(

                    brightness=0.15,

                    contrast=0.15

                ),

                transforms.ToTensor(),

                transforms.Normalize(

                    mean=[0.485,0.456,0.406],

                    std=[0.229,0.224,0.225]

                )

            ])

        return transforms.Compose([

            transforms.ToPILImage(),

            transforms.ToTensor(),

            transforms.Normalize(

                mean=[0.485,0.456,0.406],

                std=[0.229,0.224,0.225]

            )

        ])

    ############################################################

    def __getitem__(
            self,
            index
    ):

        sample = self.samples[index]

        image = self.crop_object(

            sample["image"],

            sample["bbox"]

        )

        image = self.resize(
            image
        )

        image = self.transform(
            image
        )

        return image, sample["label"]