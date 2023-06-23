import fetch from "node-fetch";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

const randomDexNum = getRandomInt(905);

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const res = await fetch("https://graphqlpokemon.favware.tech/v7", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        {
          getPokemonByDexNumber(number: ${randomDexNum}) {
              sprite
              num
              species
              bulbapediaPage
          }
        }
      `,
      }),
    });

    const data = await res.json();

    const pokemon = data["data"]["getPokemonByDexNumber"];

    const writeCom = new PutCommand({
      TableName: "Hourly-Pokemon",
      Item: {
        index: 1,
        dex_num: pokemon["num"],
        sprite: pokemon["sprite"],
        species: pokemon["species"],
        bulbapedia: pokemon["bulbapediaPage"],
      },
    });

    const writeRes = await docClient.send(writeCom);

    return {
      statusCode: 200,
      isBase64Encoded: false,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pokemon),
    };
  } catch (e) {
    return {
      statusCode: 500,
      isBase64Encoded: false,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(e.code + ": " + e.message),
    };
  }
};
