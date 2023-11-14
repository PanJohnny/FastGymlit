import type { AstroGlobal } from "astro";
import { XMLParser } from "fast-xml-parser";
const parser = new XMLParser();

export async function GET(Astro: AstroGlobal) {
  let page = Astro.url.searchParams.get("page") || 0;

  // @ts-ignore Just typescript being crazy with enums
  let category = Object.keys(Category)[Object.values(Category).indexOf(Astro.url.searchParams.get("category"))];
  console.log(category);
  

  if (page !== 0)
    page = parseInt(page + "");

  // @ts-ignore
  const feed = await getFeed(category, page);

  return new Response(JSON.stringify(feed), {
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