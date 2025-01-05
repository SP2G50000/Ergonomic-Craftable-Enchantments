/** The Enchantment Recipe Type used to define an enchantment recipe that will be created, alongside its recipe advancement. */
interface EnchantmentRecipe {
  /** The ID of the enchantment */
  id: string;
  /** The enchantment's associated item, used for crafting the enchantment (alongside a book and 4 lapis). */
  ingredient: string;
  /** The level of the enchantment the recipe outputs. Default value is 1 if left undefined. */
  level?: number;
}

type EnchantmentsRecipes = EnchantmentRecipe[];

const RECIPE_LIST: EnchantmentsRecipes = [
  {
    id: "mending",
    ingredient: "ender_eye",
  },
  {
    id: "unbreaking",
    ingredient: "crying_obsidian",
    level: 2,
  },
  {
    id: "aqua_affinity",
    ingredient: "prismarine_crystals",
  },
  {
    id: "depth_strider",
    ingredient: "copper_ingot",
  },
  {
    id: "efficiency",
    ingredient: "gold_ingot",
    level: 2,
  },
  {
    id: "feather_falling",
    ingredient: "phantom_membrane",
  },
  {
    id: "fortune",
    ingredient: "amethyst_shard",
  },
  {
    id: "looting",
    ingredient: "ender_pearl",
  },
  {
    id: "protection",
    ingredient: "armadillo_scute",
  },
  {
    id: "respiration",
    ingredient: "turtle_scute",
    level: 2,
  },
  {
    id: "sharpness",
    ingredient: "pitcher_plant",
    level: 3,
  },
  {
    id: "silk_touch",
    ingredient: "honeycomb",
  },
  {
    id: "swift_sneak",
    ingredient: "echo_shard",
    level: 3,
  },
  { //TODO: Finish this!
    id: "blast_protection",
    ingredient: "gunpowder",
  },
  {
    id: "fire_protection",
    ingredient: "blaze_powder",
  },
  {
    id: "fire_aspect",
    ingredient: "fire_charge",
  },
  {
    id: "flame",
    ingredient: "magma_cream",
  },
  {
    id: "frost_walker",
    ingredient: "blue_ice",
  },
  {
    id: "infinity",
    ingredient: "chorus_fruit",
  },
  {
    id: "knockback",
    ingredient: "ghast_tear",
    level: 2,
  },
  {
    id: "multishot",
    ingredient: "spectral_arrow",
  },
  {
    id: "piercing",
    ingredient: "quartz",
  },
  {
    id: "power",
    ingredient: "glow_berries",
  },
  {
    id: "projectile_protection",
    ingredient: "flint",
  },
  {
    id: "punch",
    ingredient: "chorus_flower",
  },
  {
    id: "quick_charge",
    ingredient: "sugar",
  },
  {
    id: "soul_speed",
    ingredient: "gilded_blackstone",
  },
  {
    id: "sweeping_edge",
    ingredient: "feather",
  },
  {
    id: "thorns",
    ingredient: "pointed_dripstone",
  },
  {
    id: "channeling",
    ingredient: "prismarine_shard",
  },
  {
    id: "loyalty",
    ingredient: "sponge",
    level: 2,
  },
  {
    id: "luck_of_the_sea",
    ingredient: "kelp",
  },
  {
    id: "lure",
    ingredient: "bread",
  },
  {
    id: "riptide",
    ingredient: "sea_pickle",
  },
  {
    id: "impaling",
    ingredient: "seagrass",
    level: 2,
  },
  {
    id: "bane_of_arthropods",
    ingredient: "spider_eye",
    level: 3,
  },
  {
    id: "binding_curse",
    ingredient: "slime_ball",
  },
  {
    id: "vanishing_curse",
    ingredient: "lily_of_the_valley",
  },
  {
    id: "smite",
    ingredient: "rotten_flesh",
    level: 3,
  },
];

// Removes the generated data pack if it already exists.
try {
  await Deno.remove("output", { recursive: true });
} catch {
  /* No need to stop if this fails*/
}

// Generates the datapack.
const DATAPACK_NAMESPACE = "ergonomic_enchant_recipes";

const DATAPACK_PATH = `output/Ergonomic Craftable Enchants`;
const ADVANCEMENT_PATH =
  `${DATAPACK_PATH}/data/${DATAPACK_NAMESPACE}/advancement/recipes/misc`;
const RECIPE_PATH = `${DATAPACK_PATH}/data/${DATAPACK_NAMESPACE}/recipe`;

//Sets up the directory structure of the datapack.

await Deno.mkdir(ADVANCEMENT_PATH, { recursive: true });
await Deno.mkdir(RECIPE_PATH, { recursive: true });

//Creates pack.mcmeta
await Deno.writeTextFile(
  `${DATAPACK_PATH}/pack.mcmeta`,
  JSON.stringify(
    {
      "pack": {
        "description": "Balanced craftable enchantment recipes for Minecraft",
        "pack_format": 61,
      },
    },
  ),
);

//Copies pack.png to the datapack directory.
await Deno.copyFile("static/pack.png", `${DATAPACK_PATH}/pack.png`);

//Creates each recipe.
for (const recipe of RECIPE_LIST) {
  const datapackRedicpe = `\
{
  "type": "minecraft:crafting_shaped",
  "category": "equipment",
  "pattern": [
    "ALA",
    "LBL",
    "ALA"
  ],
  "key": {
    "A": "minecraft:${recipe.ingredient}",
    "L": "minecraft:lapis_lazuli",
    "B": "minecraft:book"
  },
  "result": {
    "id": "minecraft:enchanted_book",
    "components": {
      "minecraft:stored_enchantments": {
        "levels": {
          "minecraft:${recipe.id}": ${recipe.level ?? 1}
        }
      }
    },
    "count": 1
  }
}\
    `;

  await Deno.writeTextFile(`${RECIPE_PATH}/${recipe.id}.json`, datapackRedicpe);
}

//Creates the recpie unlock advancement
const recpieUnlockAdvancement = `\
{
    "parent": "minecraft:recipes/root",
    "criteria": {
      "has_lapis_lazuli": {
        "conditions": {
          "items": [
            {
              "items": "minecraft:lapis_lazuli"
            }
          ]
        },
        "trigger": "minecraft:inventory_changed"
      },
      "has_the_recipe": {
        "conditions": {
          "recipe": "minecraft:lapis_block"
        },
        "trigger": "minecraft:recipe_unlocked"
      }
    },
    "requirements": [
      [
        "has_the_recipe",
        "has_lapis_lazuli"
      ]
    ],
    "rewards": {
      "recipes": ${
  JSON.stringify(RECIPE_LIST.map((recipe) => {
    return `${DATAPACK_NAMESPACE}:${recipe.id}`;
  }))
}
    }
}\
`;

await Deno.writeTextFile(
  `${ADVANCEMENT_PATH}/craftable_enchantments.json`,
  recpieUnlockAdvancement,
);

console.log("Finished generating datapack!");
