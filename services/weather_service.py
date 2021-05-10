from typing import Any, Dict, List


from third_party.weather.weather_client import weather


def fetch_weather_information(zip_code: str) -> List[Dict[str, Any]]:
    # weather_info = weather.get_temp_next_96_hours(zip_code)
    weather_info = weather.get_temp_next_15_days(zip_code)  # type: List[Dict[str, Any]]
    # weather_info = weather.get_cloud_cover_next_96_hours(zip_code)
    return weather_info
