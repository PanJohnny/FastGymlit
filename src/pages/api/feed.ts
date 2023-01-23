import { XMLParser } from "fast-xml-parser";
const parser = new XMLParser();

export async function get({ params }) {
  return new Response(JSON.stringify(await getFeed()), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

export enum Category {
  Zadna = "",
  Novinky = "novinky",
  Uspechy = "uspechy-skoly"
}

// rss > channel > [item
export async function getFeed(category?: Category, page?: number) {
  if (!page)
    page = 0;
  if (!category)
    category = Category.Zadna

  // first try
  let categoryString: string = "/category/" + Category[category];

  // magic black wizardry shit
  if (Object.values(Category).includes(category))
    categoryString = "/category/" + category;

  if (category == Category.Zadna || category + "" == "Zadna") {
    categoryString = "";
  }
  const url = "https://www.gymlit.cz" + categoryString + "/feed/" + "?paged=" + page

  const content = await fetch(url).then((data) => data.text());

  return parser.parse(content).rss.channel.item;
}