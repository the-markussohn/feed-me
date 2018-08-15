export interface NutrientData {
  foods: Food[];
}

export interface Food {
  food_name: string;
  serving_weight_grams: number;
  nf_calories: number;
  nf_total_fat: number;
  nf_total_carbohydrate: number;
  nf_sugars: number;
  nf_protein: number;
  full_nutrients: Map<number, number>;
  photo: {
    thumb: string;
    highres: string;
    is_user_uploaded: boolean;
  };
}
