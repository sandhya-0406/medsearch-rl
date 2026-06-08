def scale_bbox(
    bbox,
    original_width,
    original_height,
    target_width,
    target_height
):

    xmin, ymin, xmax, ymax = bbox

    x_scale = target_width / original_width
    y_scale = target_height / original_height

    xmin = int(xmin * x_scale)
    xmax = int(xmax * x_scale)

    ymin = int(ymin * y_scale)
    ymax = int(ymax * y_scale)

    return [
        xmin,
        ymin,
        xmax,
        ymax
    ]


def scale_bboxes(
    bboxes,
    original_width,
    original_height,
    target_width,
    target_height
):

    return [
        scale_bbox(
            bbox,
            original_width,
            original_height,
            target_width,
            target_height
        )
        for bbox in bboxes
    ]