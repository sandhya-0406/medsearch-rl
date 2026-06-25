from backend.datasets.mri_loader import load_sample, get_all_mat_files
from backend.preprocessing.pipeline import preprocess_sample
from backend.datasets.esad_loader import ESADLoader
from backend.datasets.mesad_loader import MESADLoader


class UnifiedDataset:

    def __init__(
        self,
        mri_path=None,
        esad_path=None,
        mesad_path=None
    ):

        # MRI
        self.mri_files = (
            get_all_mat_files(mri_path)
            if mri_path is not None
            else []
        )

        # ESAD
        self.esad_loader = (
            ESADLoader(esad_path)
            if esad_path is not None
            else None
        )

        # MESAD
        self.mesad_loader = (
            MESADLoader(mesad_path)
            if mesad_path is not None
            else None
        )

        self.mri_count = len(self.mri_files)

        self.esad_count = (
            len(self.esad_loader)
            if self.esad_loader is not None
            else 0
        )

        self.mesad_count = (
            len(self.mesad_loader)
            if self.mesad_loader is not None
            else 0
        )


    def __getitem__(self, idx):

        # MRI
        if idx < self.mri_count:

            sample = load_sample(
                self.mri_files[idx]
            )

            sample = preprocess_sample(sample)

            sample["domain"] = "mri"

            return sample

        idx -= self.mri_count

        # ESAD
        if idx < self.esad_count:

            sample = self.esad_loader.load_sample(
                idx
            )

            sample = preprocess_sample(sample)

            sample["domain"] = "esad"

            return sample

        idx -= self.esad_count

        # MESAD
        if idx < self.mesad_count:

            sample = self.mesad_loader.load_sample(
                idx
            )

            sample = preprocess_sample(sample)

            sample["domain"] = "mesad"

            return sample

        raise IndexError(
            f"Index {idx} out of range"
        )


    def __len__(self):

        return (
            self.mri_count
            + self.esad_count
            + self.mesad_count
        )