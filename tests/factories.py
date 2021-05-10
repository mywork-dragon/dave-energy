import factory
from faker import Faker
import random
from app import db
from common.constants import AssetTypes
from models.building import Building
from models.asset import Asset, ThirdParties
from models.dispatch import Dispatch, EventTypes
from models.history import History
from models.point import Point
from models.user import User
from models.billing_cycle import BillingCycle
from models.billing_peak import BillingPeak
from models.company import Company
from models.device import Device
from models.energy_star import EnergyStar
from models.unit import Unit


faker = Faker()
faker.seed_instance(4321)


class CompanyFactory(factory.alchemy.SQLAlchemyModelFactory):  # type: ignore
    class Meta:
        model = Company
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    name = factory.Faker("words", unique=True)


class UserFactory(factory.alchemy.SQLAlchemyModelFactory):  # type: ignore
    class Meta:
        model = User
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    email = factory.Faker("email")
    password = factory.Faker("password")
    is_active = True
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    user_role = 0


class BuildingFactory(factory.alchemy.SQLAlchemyModelFactory):  # type: ignore
    class Meta:
        model = Building
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    name = factory.Faker("words", unique=True)
    address = factory.Faker("address")
    user = factory.SubFactory(UserFactory)


class AssetFactory(factory.alchemy.SQLAlchemyModelFactory):  # type: ignore
    class Meta:
        model = Asset
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    name = factory.Faker("words", unique=True)
    energy_type = "electric"
    building = factory.SubFactory(BuildingFactory)
    third_party = ThirdParties.N4.value


class DeviceFactory(factory.alchemy.SQLAlchemyModelFactory):  # type: ignore
    class Meta:
        model = Device
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    name = factory.Faker("words", unique=True)
    asset = factory.SubFactory(AssetFactory)

class UnitFactory(factory.alchemy.SQLAlchemyModelFactory):  # type: ignore
    class Meta:
        model = Unit
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    symbol = factory.Faker("words", unique=True)
    description = factory.Faker("words", unique=True)


class PointFactory(factory.alchemy.SQLAlchemyModelFactory):  # type: ignore
    class Meta:
        model = Point
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    path = factory.Faker("words", unique=True)
    asset_type = random.choice([at.name for at in AssetTypes])
    unit = factory.SubFactory(UnitFactory)
    current_value = None
    tag = None
    is_main = True
    name = factory.Faker("words", unique=True)

    asset = factory.SubFactory(AssetFactory)
    device = factory.SubFactory(DeviceFactory)
    writable = False


class HistoryFactory(factory.alchemy.SQLAlchemyModelFactory):  # type: ignore
    class Meta:
        model = History
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    ts = factory.Faker("date_time_between", start_date="-1d", end_date="now")
    quantity = factory.Faker("random_number")

    point = factory.SubFactory(PointFactory)


class BillingCycleFactory(factory.alchemy.SQLAlchemyModelFactory):  # type: ignore
    class Meta:
        model = BillingCycle
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    building = factory.SubFactory(BuildingFactory)
    from_day = factory.Faker("random_int", min=1, max=31)


class BillingPeakFactory(factory.alchemy.SQLAlchemyModelFactory):  # type: ignore
    class Meta:
        model = BillingPeak
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    peak_value = factory.Faker("random_int", min=0, max=1000, step=1)
    from_time = factory.Faker("date_time_between", start_date="-7d", end_date="-1d")
    to_time = factory.Faker("date_time_between", start_date="-1d", end_date="now")

    building = factory.SubFactory(BuildingFactory)


class DispatchFactory(factory.alchemy.SQLAlchemyModelFactory):  # type: ignore
    class Meta:
        model = Dispatch
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    schedule_date = factory.Faker("date_time_between", start_date="-1d", end_date="now")
    end_date = factory.Faker("date_time_between", start_date="-1d", end_date="now")
    power_kw = None
    event_type = random.choice([et.value for et in EventTypes])
    status = "PENDING"
    point = factory.SubFactory(PointFactory)


class EnergyStarFactory(factory.alchemy.SQLAlchemyModelFactory):  # type: ignore
    class Meta:
        model = EnergyStar
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    value = faker.random_int(min=1, max=100)
    date = "{0}/{1}".format(faker.month(), faker.year())
    building = factory.SubFactory(BuildingFactory)