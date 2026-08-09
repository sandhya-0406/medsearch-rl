MRI_CLASSES = [

    "Glioma",

    "Meningioma",

    "Pituitary"

]

ESAD_CLASSES = [

    "CuttingMesocolon",

    "PullingVasDeferens",

    "ClippingVasDeferens",

    "CuttingVasDeferens",

    "ClippingTissue",

    "PullingSeminalVesicle",

    "ClippingSeminalVesicle",

    "CuttingSeminalVesicle",

    "SuckingBlood",

    "SuckingSmoke",

    "PullingTissue",

    "CuttingTissue",

    "ClippingLymphNode",

    "CuttingLymphNode",

    "PullingLymphNode",

    "Gallbladder",

    "Liver",

    "LymphNode",

    "Blood",

    "Tissue",

    "Background"

]

MESAD_CLASSES = ESAD_CLASSES

CLASS_NAMES = {

    "MRI": MRI_CLASSES,

    "ESAD": ESAD_CLASSES,

    "MESAD": MESAD_CLASSES

}