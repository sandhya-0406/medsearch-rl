from pathlib import Path
import h5py

def load_sample(mat_path):
    with h5py.File(mat_path,"r") as f:
        cjdata = f['cjdata']
        image  = cjdata['image'][()]
        mask = cjdata['tumorMask'][()]
        label = int(cjdata['label'][()][0][0])
        pid = cjdata['PID'][()]

    return {
        "image" : image,
        "mask" : mask,
        "label" : label,
        "pid" : pid
    }

def get_all_mat_files(data_dir = "data"):

    data_dir = Path(data_dir)
    mat_files = []
    for file in data_dir.rglob("*.mat"):
        if file.name != "cvind.mat":
            mat_files.append(file)
    
    return sorted(mat_files)
