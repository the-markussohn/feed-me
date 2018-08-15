export interface CommonProduct {
  food_name: string;
  serving_unit: string;
  serving_qty: number;
  photo: {
    thumb: string
  };
  tag_id: number;
  locale: string;
}
