from marshmallow import Schema, fields, post_load
from common.utils import est_to_utc_datetime, get_zero_hour_time


class EntityValue(fields.Field):  # type: ignore
    """Field that checks for Number and Bool values and returns relevant one
    """

    def _serialize(self, value, attr, obj, **kwargs):  # type: ignore
        if isinstance(value, bool):
            return fields.Boolean().serialize(value, attr, obj, **kwargs)
        if isinstance(value, int):
            return fields.Integer().serialize(value, attr, obj, **kwargs)
        if isinstance(value, float):
            return fields.Float().serialize(value, attr, obj, **kwargs)

    def _deserialize(self, value, attr, data, **kwargs):  # type: ignore
        if isinstance(value, bool):
            return fields.Boolean().deserialize(value, attr, data, **kwargs)
        if isinstance(value, int):
            return fields.Integer().deserialize(value, attr, data, **kwargs)
        if isinstance(value, float):
            return fields.Float().deserialize(value, attr, data, **kwargs)


class PointRequestSchema(Schema):  # type: ignore
    id = fields.Integer(required=True, allow_none=False)
    value = EntityValue()


class TogglePointSchema(Schema):  # type: ignore
    value = fields.Boolean(required=False, missing=True)


class PointHistorySchema(Schema):  # type: ignore
    from_time = fields.DateTime(
        allow_none=False, missing=get_zero_hour_time(days=0), required=False
    )
    to_time = fields.DateTime(
        allow_none=False, missing=get_zero_hour_time(days=1), required=False
    )

    @post_load
    def convert_datetimes_in(self, data, **kwargs):  # type: ignore
        """On input, convert FE time (EST) to UTC."""
        data["from_time"] = est_to_utc_datetime(data["from_time"])
        data["to_time"] = est_to_utc_datetime(data["to_time"])
        return data


point_history_schema = PointHistorySchema()
point_request_schema = PointRequestSchema()
point_toggle_schema = TogglePointSchema()
