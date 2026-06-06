import numpy as np
# from dataset_loader import load_sample
# sample = load_sample("./data/figshare/brainTumorDataPublic_1533-2298/1534.mat")
def mask_to_bbox(mask):
    rows,cols = np.where(mask==1)

    x_min = int(cols.min())
    x_max = int(cols.max())

    y_min = int(rows.min())
    y_max = int(rows.max())

    return (
        x_min,
        y_min,
        x_max,
        y_max
    )

# bbox = mask_to_bbox(sample["mask"])

# print(bbox)