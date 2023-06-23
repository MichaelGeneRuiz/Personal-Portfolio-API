import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const getCom = new GetCommand({
      TableName: "Hourly-Pokemon",
      Key: {
        index: 1,
      },
    });

    const res = await docClient.send(getCom);

    return {
      statusCode: 200,
      isBase64Encoded: false,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(res.Item),
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
