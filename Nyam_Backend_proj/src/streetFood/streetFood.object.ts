import { Types } from 'mongoose';
import { getCurrentDate, getCurrentDay } from '../common/util/dateTime';
import { StreetFood } from './streetFood.model';
import { OtherAdmin } from 'src/user/objects/admin.object';

export class StreetFoodAddress {
  type: string;
  coordinates: [number, number];
  local_address: string;
  load_address: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
  region_5depth_name: string;
  lon: number;
  lat: number;

  constructor(data) {
    this.type = 'Point';
    this.local_address = data.local_address;
    this.load_address = data.load_address;
    this.region_1depth_name = data.region_1depth_name;
    this.region_2depth_name = data.region_2depth_name;
    this.region_3depth_name = data.region_3depth_name;
    this.region_4depth_name = data.region_4depth_name;
    this.region_5depth_name = data.region_5depth_name;
    this.coordinates = [data.lon, data.lat];
    this.lon = data.lon;
    this.lat = data.lat;
  }
}

export class StreetFoodAddRequest {
  campus_id: Types.ObjectId;
  street_food_name: string;
  street_food_sub: string;
  street_food_image: string;
  street_food_location: string;
  street_food_created_at: Date;
  street_food_start_at: Date;
  street_food_end_at: Date;
  street_food_address: StreetFoodAddress;
  constructor(data) {
    this.campus_id = data.campus_id;
    this.street_food_name = data.street_food_name;
    this.street_food_sub = data.street_food_sub;
    this.street_food_image = data.street_food_image;
    this.street_food_location = data.street_food_location;
    this.street_food_created_at = getCurrentDate(new Date());
    this.street_food_start_at = new Date(data.street_food_start_at);
    this.street_food_end_at = new Date(data.street_food_end_at);
    this.street_food_address = new StreetFoodAddress(data.street_food_address);
  }
}
export class StreetFoodUpdateRequest {
  street_food_id: Types.ObjectId;
  campus_id: Types.ObjectId;
  street_food_name: string;
  street_food_sub: string;
  street_food_image: string;
  street_food_start_at: Date;
  street_food_end_at: Date;
  street_food_address: StreetFoodAddress;
  street_food_location: string;
  constructor(data) {
    this.street_food_id = data.street_food_id;
    this.campus_id = data.campus_id;
    this.street_food_sub = data.street_food_sub;
    this.street_food_name = data.street_food_name;
    this.street_food_image = data.street_food_image;
    this.street_food_start_at = new Date(data.street_food_start_at);
    this.street_food_end_at = new Date(data.street_food_end_at);
    this.street_food_address = data.street_food_address;
    this.street_food_location = data.street_food_location;
  }
}

export class StreetFoodView {
  street_food_id: Types.ObjectId;
  campus_id: Types.ObjectId;
  street_food_sub: string;
  street_food_name: string;
  street_food_image: string;
  street_food_start_at: Date;
  street_food_end_at: Date;
  street_food_block: boolean;
  street_food_active: boolean;
  street_food_location: string;
  street_food_address: StreetFoodAddress;
  constructor(street_food: StreetFood) {
    this.street_food_id = street_food.id;
    this.campus_id = street_food.campus_id;
    this.street_food_sub = street_food.street_food_sub;
    this.street_food_name = street_food.street_food_name;
    this.street_food_image = street_food.street_food_image;
    this.street_food_start_at = street_food.street_food_start_at;
    this.street_food_end_at = street_food.street_food_end_at;
    this.street_food_active = street_food.street_food_active;
    this.street_food_block = street_food.street_food_block;
    this.street_food_address = street_food.street_food_address;
    this.street_food_location = street_food.street_food_location;
  }
}

export class StreetFoodMangeView {
  street_food_id: Types.ObjectId;
  campus_id: Types.ObjectId;
  street_food_name: string;
  street_food_sub: string;
  street_food_image: string;
  street_food_start_at: Date;
  street_food_end_at: Date;
  street_food_created_at: Date;
  street_food_block: boolean;
  street_food_active: boolean;
  admin: OtherAdmin;
  street_food_location: string;
  street_food_address: StreetFoodAddress;
  constructor(street_food: StreetFood) {
    this.street_food_id = street_food.id;
    this.campus_id = street_food.campus_id;
    this.street_food_sub = street_food.street_food_sub;
    this.street_food_name = street_food.street_food_name;
    this.street_food_image = street_food.street_food_image;
    this.street_food_start_at = street_food.street_food_start_at;
    this.street_food_end_at = street_food.street_food_end_at;
    this.street_food_created_at = street_food.street_food_created_at;
    this.street_food_block = street_food.street_food_block;
    this.street_food_active = street_food.street_food_active;
    this.admin = street_food.admin;
    this.street_food_address = street_food.street_food_address;
    this.street_food_location = street_food.street_food_location;
  }
}
export class StreetFoodQuery {
  campus_id: Types.ObjectId;
  street_food_block: boolean;
  active: boolean;
  start: boolean;
  end: boolean;

  constructor(data) {
    this.campus_id = data.campus_id;
    this.street_food_block = data.street_food_block;
    this.active = data.active;
    this.start = data.start;
    this.end = data.end;
  }
  Query() {
    const query = { street_food_active: true, street_food_block: false };
    if (this.campus_id) {
      query['campus_id'] = this.campus_id;
    }
    if (this.active) {
      query['street_food_start_at'] = { $lte: getCurrentDate(new Date()) };
      query['street_food_end_at'] = { $gte: getCurrentDay(new Date()) };
    }
    if (this.street_food_block) {
      query['street_food_block'] = true;
    }
    if (this.start) {
      query['street_food_start_at'] = { $gt: getCurrentDate(new Date()) };
    }
    if (this.end) {
      query['street_food_end_at'] = { $lt: getCurrentDay(new Date()) };
    }
    return query;
  }
}
export class StreetFoodInnerQuery {
  campus_id: Types.ObjectId;
  street_food_block: boolean;
  active: boolean;
  start: boolean;
  end: boolean;

  constructor(data) {
    this.campus_id = data.campus_id;
    this.street_food_block = data.street_food_block;
    this.active = data.active;
    this.start = data.start;
    this.end = data.end;
  }
  Query() {
    const query = { street_food_active: true, street_food_block: false };
    if (this.campus_id) {
      query['campus_id'] = this.campus_id;
    }
    if (this.active) {
      query['street_food_start_at'] = { $lte: getCurrentDate(new Date()) };
      query['street_food_end_at'] = { $gte: getCurrentDay(new Date()) };
    }
    if (this.street_food_block) {
      query['street_food_block'] = true;
    }
    if (this.start) {
      query['street_food_start_at'] = { $gt: getCurrentDate(new Date()) };
    }
    if (this.end) {
      query['street_food_end_at'] = { $lt: getCurrentDay(new Date()) };
    }
    return query;
  }
}
