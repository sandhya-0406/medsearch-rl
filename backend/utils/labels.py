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
        "BaggingProstate",
        "BladderNeckDissection",
        "BladderAnastomosis",
        "PullingProstate",
        "ClippingBladderNeck",
        "CuttingThread",
        "UrethraDissection",
        "CuttingProstate",
        "PullingBladderNeck"
]

MESAD_CLASSES = ESAD_CLASSES

CLASS_NAMES = {

    "MRI": MRI_CLASSES,

    "ESAD": ESAD_CLASSES,

    "MESAD": MESAD_CLASSES

}