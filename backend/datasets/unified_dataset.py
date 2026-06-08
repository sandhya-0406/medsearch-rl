
from backend.datasets.mri_loader import load_sample as load_mri_sample
from backend.datasets.mri_loader import get_all_mat_files
from backend.preprocessing.pipeline import preprocess_sample
from backend.datasets.esad_loader import ESADLoader
from backend.datasets.mesad_loader import MESADLoader

class UnifiedDataset:

    def __init__(
        self,
        mri_path,
        esad_path,
        mesad_path
    ):

        self.mri_files = get_all_mat_files(
            mri_path
        )

        self.esad_loader = ESADLoader(
            esad_path
        )

        self.mesad_loader = MESADLoader(
            mesad_path
        )

        self.mri_count = len(
            self.mri_files
        )

        self.esad_count = len(
            self.esad_loader
        )

        self.mesad_count = len(
            self.mesad_loader
        )


    def __getitem__(self, idx):

        if idx < self.mri_count:

            sample = load_mri_sample(
                self.mri_files[idx]
            )

            return preprocess_sample(sample)

        idx -= self.mri_count

        if idx < self.esad_count:

            sample = self.esad_loader.load_sample(
                idx
            )

            return preprocess_sample(sample)

        idx -= self.esad_count

        sample = self.mesad_loader.load_sample(
            idx
        )

        return preprocess_sample(sample)
    
    def __len__(self):

        return (
            self.mri_count +
            self.esad_count +
            self.mesad_count
        )