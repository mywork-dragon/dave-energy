from datetime import datetime

from tests.factories import PointFactory


def get_point_and_history(device):  # type:ignore
    point = PointFactory.create(device=device)

    point_history = [
        dict(
            ts=datetime(2020, 2, 24, 0, 0, 0, 748000),
            quantity="311.9746",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 0, 15, 1, 235000),
            quantity="317.4664",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 0, 30, 1, 270000),
            quantity="310.9453",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 0, 45, 0, 234000),
            quantity="308.842",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 1, 0, 0, 301000),
            quantity="301.88",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 1, 15, 0, 224000),
            quantity="316.7204",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 1, 30, 0, 255000),
            quantity="309.9519",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 1, 45, 1, 240000),
            quantity="316.0624",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 2, 0, 0, 216000),
            quantity="321.7589",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 2, 15, 0, 228000),
            quantity="316.0268",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 2, 30, 0, 253000),
            quantity="311.0622",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 2, 45, 0, 254000),
            quantity="307.6075",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 3, 0, 0, 254000),
            quantity="311.0985",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 3, 15, 0, 245000),
            quantity="310.468",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 3, 30, 0, 214000),
            quantity="301.2234",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 3, 45, 1, 263000),
            quantity="311.1798",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 4, 0, 0, 217000),
            quantity="315.2839",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 4, 15, 0, 220000),
            quantity="318.8307",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 4, 30, 0, 253000),
            quantity="318.9294",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 4, 45, 0, 263000),
            quantity="322.7214",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 5, 0, 0, 217000),
            quantity="317.4688",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 5, 15, 0, 215000),
            quantity="321.054",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 5, 30, 0, 252000),
            quantity="322.6294",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 5, 45, 0, 222000),
            quantity="326.791",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 6, 0, 0, 265000),
            quantity="417.141",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 6, 15, 0, 226000),
            quantity="443.9669",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 6, 30, 0, 215000),
            quantity="441.0729",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 6, 45, 0, 256000),
            quantity="535.5657",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 7, 0, 0, 212000),
            quantity="624.8365",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 7, 15, 0, 221000),
            quantity="638.0957",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 7, 30, 0, 240000),
            quantity="660.9526",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 7, 45, 1, 429000),
            quantity="677.4436",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 8, 0, 0, 260000),
            quantity="685.4829",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 8, 15, 0, 263000),
            quantity="725.8912",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 8, 30, 0, 224000),
            quantity="742.7706",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 8, 45, 1, 237000),
            quantity="779.9854",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 9, 0, 0, 636000),
            quantity="811.3544",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 9, 15, 0, 214000),
            quantity="821.8167",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 9, 30, 0, 262000),
            quantity="842.8825",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 9, 45, 0, 234000),
            quantity="859.2202",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 10, 0, 0, 706000),
            quantity="884.9091",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 10, 15, 0, 257000),
            quantity="894.5764",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 10, 30, 0, 589000),
            quantity="895.2421",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 10, 45, 1, 274000),
            quantity="900.7006",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 11, 0, 0, 222000),
            quantity="905.4908",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 11, 15, 0, 247000),
            quantity="899.8695",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 11, 30, 0, 242000),
            quantity="912.3646",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 11, 45, 0, 261000),
            quantity="919.6195",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 12, 0, 0, 238000),
            quantity="918.9966",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 12, 15, 0, 260000),
            quantity="926.2059",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 12, 30, 0, 232000),
            quantity="932.8849",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 12, 45, 0, 228000),
            quantity="938.3545",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 13, 0, 0, 277000),
            quantity="957.0065",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 13, 15, 0, 273000),
            quantity="942.082",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 13, 30, 0, 269000),
            quantity="927.8229",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 13, 45, 0, 275000),
            quantity="936.9117",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 14, 0, 0, 221000),
            quantity="937.6226",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 14, 15, 0, 222000),
            quantity="930.7449",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 14, 30, 0, 255000),
            quantity="946.7539",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 14, 45, 0, 288000),
            quantity="933.8076",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 15, 0, 0, 251000),
            quantity="931.8519",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 15, 15, 0, 208000),
            quantity="926.7661",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 15, 30, 0, 269000),
            quantity="925.3024",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 15, 45, 0, 251000),
            quantity="914.1494",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 16, 0, 0, 260000),
            quantity="927.3884",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 16, 15, 0, 232000),
            quantity="908.8822",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 16, 30, 0, 328000),
            quantity="894.0279",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 16, 45, 0, 305000),
            quantity="895.951",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 17, 0, 0, 691000),
            quantity="900.563",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 17, 15, 0, 448000),
            quantity="886.5423",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 17, 30, 0, 248000),
            quantity="833.6823",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 17, 45, 0, 240000),
            quantity="705.6531",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 18, 0, 0, 271000),
            quantity="668.0378",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 18, 15, 0, 211000),
            quantity="645.9318",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 18, 30, 0, 264000),
            quantity="640.7148",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 18, 45, 0, 230000),
            quantity="573.7238",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 19, 0, 0, 650000),
            quantity="509.5991",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 19, 15, 0, 226000),
            quantity="484.8775",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 19, 30, 0, 233000),
            quantity="473.9285",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 19, 45, 0, 265000),
            quantity="449.4394",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 20, 0, 0, 260000),
            quantity="435.9711",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 20, 15, 0, 261000),
            quantity="421.6006",
            point_id=point.id,
        ),
        dict(
            ts=datetime(2020, 2, 24, 20, 30, 0, 18000),
            quantity="418.1495",
            point_id=point.id,
        ),
    ]

    return point, point_history
