from marshmallow import Schema, fields


class WeatherRequestSchema(Schema):  # type: ignore
    zip_code = fields.Str(required=True, allow_none=False)


weather_request_schema = WeatherRequestSchema()
