// types/db.ts

export interface Profile {
    id: string; // uuid, same as auth.users.id
    username: string; // text
    full_name: string | null; // text, nullable
    created_at: string; // timestamp -> ISO string from Supabase
    updated_at: string; // timestamp -> ISO string
  }
  
  export interface Recipe {
    id: string; // uuid
    created_at: string; // timestamptz -> ISO string
    user_id: string; // uuid, references profiles.id / auth.users.id
    title: string; // text
    description: string; // text
    ingredients: string[]; // text[] in Postgres
    cooking_time: number; // int4
    difficulty: string; // text
    category: string; // text
    instructions: string[]; // text[] in Postgres
    /** Diet/mood labels — requires `tags text[]` column in Supabase (see supabase/migrations). */
    tags?: string[] | null;
  }
  
  /**
   * Helper types if you want stricter Supabase usage:
   * - RecipeRow / ProfileRow: actual rows from DB
   * - RecipeInsert / ProfileInsert: payloads you send to insert()
   */
  
  export type ProfileRow = Profile;
  export type RecipeRow = Recipe;
  
  // When inserting, created_at / updated_at / id are usually defaulted by DB
  export type ProfileInsert = Omit<Profile, "id" | "created_at" | "updated_at"> & {
    id?: string;
    created_at?: string;
    updated_at?: string;
  };
  
  export type RecipeInsert = Omit<Recipe, "id" | "created_at"> & {
    id?: string;
    created_at?: string;
  };

  export interface Favorite {
    id: string;
    user_id: string;
    recipe_id: string;
    created_at: string;
  }