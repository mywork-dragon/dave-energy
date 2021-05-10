from marshmallow import Schema, fields
from marshmallow.decorators import post_load
from models.dispatch import Dispatch

from app import ma


class DispatchReqSchema(Schema):  # type:ignore
    schedule_date = fields.DateTime(format="%d/%m/%y %H:%M", required=True)
    mode = fields.Str(allow_none=True, required=False)
    power_kw = fields.Float(required=False, allow_none=True)
    point_id = fields.Integer(required=True)
    event_type = fields.Str(allow_none=True, required=False)

    @post_load()
    def get_initial_end_date(self, in_data, **kwargs):  # type:ignore
        in_data["end_date"] = in_data["schedule_date"]
        return in_data


class DispatchSchema(ma.ModelSchema):  # type: ignore
    class Meta:
        model = Dispatch
        fields = (
            "schedule_date",
            "mode",
            "power_kw",
            "point_id",
            "event_type",
            "end_date",
        )


dispatching_schema = DispatchSchema(many=True)
dispatch_req_schema = DispatchReqSchema(many=True)
