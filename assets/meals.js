class Meal {
  constructor(name, tags, url) {
    this.name = name;
    this.tags = tags;
    this.url  = url;
  }
}

const meals = [
  new Meal(
    "Broccoli and Stilton soup",
    [
      "vegetarian",
      "soup",
      "scales",
      "freezes",
      "better-next-day",
      "slow",
      "cold-weather"
    ]
  ),
  new Meal(
    "Mushroom Soup",
    [
      "vegan",
      "soup",
      "slow",
      "scales",
      "freezes",
      "cold-weather"
    ]
  ),
  new Meal(
    "Avocado and coconut soup",
    [
      "vegan",
      "soup",
      "scales",
      "freezes"
    ]
  ),
  new Meal(
    "Spiced Parsnip & Apple Soup",
    [
      "soup",
      "scales",
      "vegan-ish",
      "spicy",
      "freezes"
    ]
  ),
  new Meal(
    "Spicy butternut and coconut soup",
    [
      "soup",
      "scales",
      "vegan",
      "freezes"
    ]
  ),
  new Meal(
    "Harira Soup",
    [
      "soup",
      "scales",
      "vegan",
      "freezes",
      "cold-weather"
    ]
  ),
  new Meal(
    "Blue cheese gnocchi",
    [
      "stodge",
      "quick",
      "vegetarian-ish",
      "cold-weather"
    ]
  ),
  new Meal(
    "Stir fry",
    [
      "quick",
      "vegetarian"
    ]
  ),
  new Meal(
    "Mushroom risotto",
    [
      "vegetarian"
    ]
  ),
  new Meal(
    "Beetroot risotto",
    [
      "vegetarian",
      "slow",
      "hot-weather"
    ]
  ),
  new Meal(
    "Butternut squash risotto",
    [
      "vegan",
      "hot-weather"
    ]
  ),
  new Meal(
    "Tomato sauce",
    [
      "freezes",
      "scales",
      "slow",
      "better-next-day"
    ]
  ),
  new Meal(
    "Roasted vegetable lasagne",
    [
      "slow",
      "effort",
      "vegetarian",
      "scales"
    ]
  ),
  new Meal(
    "Macaroni",
    [
      "scales",
      "vegetarian",
      "cold-weather",
      "stodge"
    ]
  ),
  new Meal(
    "Salmon pasta",
    [
      "pescatarian",
      "hot-weather"
    ]
  ),
  new Meal(
    "Sweet chilli feta pasta",
    [
      "quick",
      "vegetarian"
    ]
  ),
  new Meal(
    "Lemon pine nut pasta",
    [
      "quick",
      "vegetarian"
    ]
  ),
  new Meal(
    "Mozzarella and spinach pancakes",
    [
      "effort",
      "vegetarian"
    ]
  ),
  new Meal(
    "Melty mushroom wellingtons",
    [
      "slow",
      "vegetarian",
      "stodge",
      "cold-weather"
    ]
  ),
  new Meal(
    "Courgette and spinach pasties",
    [
      "slow",
      "vegetarian",
      "stodge"
    ]
  ),
  new Meal(
    "Mushroom stroganoff",
    [
      "vegetarian",
      "scales"
    ]
  ),
  new Meal(
    "Mushroom flan",
    [
      "stodge",
      "slow",
      "vegetarian"
    ]
  ),
  new Meal(
    "Broccoli & salmon flan",
    [
      "stodge",
      "slow",
      "pescatarian"
    ]
  ),
  new Meal(
    "Cheese and olive tarts",
    [
      "vegetarian"
    ]
  ),
  new Meal(
    "Chilli con Carne",
    [
      "vegetarian-ish",
      "freezes",
      "better-next-day",
      "scales"
    ]
  ),
  new Meal(
    "Potato gratin",
    [
      "vegetarian",
      "slow",
      "effort",
      "stodge",
      "scales",
      "cold-weather"
    ]
  ),
  new Meal(
    "Fettucine with Dolcelatte and Spinach",
    [
      "vegetarian",
      "quick",
      "hot-weather"
    ]
  ),
  new Meal(
    "Sweetcorn and spinach polenta",
    [
      "vegetarian-ish",
      "quick",
      "scales",
      "hot-weather"
    ]
  ),
  new Meal(
    "Ricotta spinach pitas",
    [
      "quick",
      "vegetarian",
      "hot-weather"
    ]
  ),
  new Meal(
    "Tuna and rice peppers",
    [
      "pescatarian",
      "slow"
    ]
  ),
  new Meal(
    "Penne with Walnut sauce",
    [
      "quick",
      "vegetarian",
      "hot-weather"
    ]
  ),
  new Meal(
    "Dahl",
    [
      "vegan",
      "scales"
    ]
  ),
  new Meal(
    "Cod with Lentils",
    [
      "quick",
      "pescatarian"
    ]
  ),
  new Meal(
    "Kashtouri  (Lentils, Rice and Pasta)",
    [
      "vegan",
      "scales",
      "hot-weather"
    ]
  ),
  new Meal(
    "Aubergine curry",
    [
      "vegan",
      "scales",
      "slow"
    ]
  ),
  new Meal(
    "Lentil Shepherd's Pie",
    [
      "vegetarian",
      "slow",
      "effort",
      "scales",
      "cold-weather"
    ]
  ),
  new Meal(
    "Roast Nut Omelette",
    [
      "quick",
      "vegetarian"
    ]
  ),
  new Meal(
    "Baked Rigatoni with Aubergine",
    [
      "vegetarian",
      "slow",
      "scales"
    ]
  ),
  new Meal(
    "Lentil & Spinach Stew",
    [
      "vegan",
      "scales"
    ]
  ),
  new Meal(
    "Mexican Polenta Pie",
    [
      "vegetarian",
      "slow",
      "scales"
    ]
  ),
  new Meal(
    "Lentil & Vegetable Pilaf",
    [
      "vegan",
      "scales"
    ]
  ),
  new Meal(
    "Spicy Broccoli & Cauliflower",
    [
      "vegetarian",
      "quick",
      "scales",
      "hot-weather"
    ]
  ),
  new Meal(
    "Tuna in tomato sauce",
    [
      "pescatarian"
    ]
  ),
  new Meal(
    "Cod in tomato sauce",
    [
      "pescatarian"
    ]
  ),
  new Meal(
    "Aubergine & Mozzarella Bake",
    [
      "vegetarian",
      "slow"
    ]
  ),
  new Meal(
    "Aubergine & Halloumi Lasagne",
    [
      "slow",
      "vegetarian",
      "scales"
    ]
  ),
  new Meal(
    "Bean & Lentil Lasagne",
    [
      "slow",
      "effort",
      "scales",
      "vegetarian"
    ]
  ),
  new Meal(
    "Lentil & Mint Patties",
    [
      "vegetarian",
      "effort",
      "slow"
    ]
  ),
  new Meal(
    "Carrot & Coriander Burgers",
    [
      "vegetarian",
      "slow",
      "effort"
    ]
  ),
  new Meal(
    "Parsnip and Butter Bean Crumble",
    [
      "vegetarian-ish",
      "slow",
      "effort",
      "scales"
    ]
  ),
  new Meal(
    "Pasta & Pesto",
    [
      "vegetarian-ish",
      "quick",
      "scales",
      "hot-weather"
    ]
  ),
  new Meal(
    "Gnocchi & Tomato Bake",
    [
      "vegetarian",
      "scales"
    ]
  ),
  new Meal(
    "Kedgeree",
    [
      "pescatarian",
      "scales"
    ]
  ),
  new Meal(
    "Venetian Style Pasta",
    [
      "quick",
      "vegan",
      "scales",
      "hot-weather"
    ]
  ),
  new Meal(
    "Egg & Mozzarella Toasts",
    [
      "vegetarian",
      "quick"
    ]
  ),
  new Meal(
    "Vegetable Hot Pot",
    [
      "vegetarian",
      "slow",
      "effort",
      "cold-weather"
    ]
  ),
  new Meal(
    "N Bean Chilli",
    [
      "vegan",
      "freezes",
      "better-next-day",
      "slow",
      "scales"
    ]
  ),
  new Meal(
    "Roast vegetable risotto",
    [
      "vegetarian",
      "slow",
      "scales"
    ]
  ),
  new Meal(
    "Mushroom and parsnip rösti pie",
    [
      "vegetarian",
      "slow",
      "effort"
    ]
  ),
  new Meal(
    "Creamy cauliflower cheese with walnuts",
    [
      "vegetarian",
      "quick"
    ]
  ),
  new Meal(
    "Mushroom Lasagne",
    [
      "vegetarian",
      "slow",
      "stodge"
    ]
  ),
  new Meal(
    "Seafood Lasagne",
    [
      "pescatarian",
      "slow",
      "stodge",
      "cold-weather"
    ]
  ),
  new Meal(
    "Spanakopita (Spinach/feta pastry)",
    [
      "vegetarian",
      "slow"
    ]
  ),
  new Meal(
    "Saag paneer",
    [
      "vegetarian",
      "hot-weather"
    ]
  ),
  new Meal(
    "Sweet Potato, Peanut Butter and Coconut Curry",
    [
      "vegetarian",
      "hot-weather"
    ]
  ),
  new Meal(
    "Vegetable Primavera (baby vegetables, filled pasta and mustard)",
    [
      "vegetarian",
      "quick",
      "hot-weather"
    ]
  ),
  new Meal(
    "Russian Mushroom Julienne",
    [
      "vegetarian",
      "stodge"
    ]
  ),
  new Meal(
    "Fishcakes",
    [
      "pescatarian"
    ]
  ),
  new Meal(
    "Grilled aubergine",
    [
      "quick",
      "vegan"
    ]
  ),
  new Meal(
    "Paneer jalfrezi",
    [
      "vegetarian",
      "quick"
    ]
  ),
  new Meal(
    "Cod and cheese stock",
    [
      "pescatarian",
      "vegan"
    ]
  ),
  new Meal(
    "Smokey fish curry",
    [
      "pescatarian"
    ]
  ),
  new Meal(
    "Tofu and cashew nut stir fry",
    [
      "vegan",
      "quick",
      "hot-weather"
    ]
  ),
  new Meal(
    "Pepper and goats cheese tart",
    [
      "vegetarian",
      "slow",
      "stodge",
      "hot-weather"
    ]
  ),
  new Meal(
    "Courgette and broccoli pasta",
    [
      "quick",
      "vegetarian",
      "hot-weather"
    ]
  ),
  new Meal(
    "Cheese scones",
    [
      "vegetarian",
      "effort",
      "stodge"
    ]
  ),
  new Meal(
    "Pizza",
    [
      "effort",
      "slow",
      "vegetarian",
      "stodge"
    ]
  ),
  new Meal(
    "Haggis",
    [
      "vegetarian",
      "slow",
      "effort",
      "scales",
      "stodge",
      "cold-weather"
    ]
  ),
  new Meal(
    "Kidney Bean & Vegetable gratin",
    [
      "vegetarian-ish",
      "scales"
    ]
  ),
  new Meal(
     "Roast veg and chickpeas tomato sauce",
     [
       "vegan",
       "freezes",
       "slow",
       "scales"
     ]
  ),
  new Meal(
    "Roast beetroot dahl",
    [
      "vegan"
    ]
  ),
  new Meal(
    "Roast vegetable Moroccan tagine",
    [
      "vegan",
      "freezes",
      "scales"
    ]
  ),
  new Meal(
    "Tofu Katsu Curry",
    [
      "vegan"
    ]
  ),
  new Meal(
    "Coconut & egg curry",
    [
      "vegetarian"
    ]
  ),
  new Meal(
    "Seitan Tagine",
    [
      "vegan",
      "freezes",
      "slow",
      "scales"
    ]
  ),
  new Meal(
    "Baked potatoes",
    [
      "slow",
      "vegetarian",
      "cold-weather"
    ]
  ),
  new Meal(
    "Beyond Burgers",
    [
      "vegetarian",
      "quick",
      "stodge"
    ]
  ),
  new Meal(
    "Roasted Vegetable Tart",
    [
      "vegetarian",
      "hot-weather"
    ]
  )
];
