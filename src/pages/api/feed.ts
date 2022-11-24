import { XMLParser } from "fast-xml-parser";
const parser = new XMLParser();

export async function get({ params }) {
  return new Response(JSON.stringify(getFeed()), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
// rss > channel > [item
export async function getFeed(novinky?:boolean) {
  const content = await fetch(novinky?"https://www.gymlit.cz/category/novinky/feed/":"https://www.gymlit.cz/feed/").then((data) => data.text());
  return parser.parse(content).rss.channel.item;
}