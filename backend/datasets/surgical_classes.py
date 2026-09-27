CLASS_NAMES = [
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

CLASS_MAP = {
    name: i 
    for i, name in enumerate(CLASS_NAMES)
}