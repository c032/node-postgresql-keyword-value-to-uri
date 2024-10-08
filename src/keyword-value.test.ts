import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { keywordValueToUri } from "./keyword-value";

const TEST_CASES: Record<string, string> = {
	"": "postgresql://",
	"dbname=database_name": "postgresql:///database_name",
	"host=localhost port=5432 dbname=mydb connect_timeout=10":
		"postgresql://localhost:5432/mydb?connect_timeout=10",
	"host=postgresql user=user_name password='correct horse battery staple' dbname=database_name sslmode=disable":
		"postgresql://user_name:correct%20horse%20battery%20staple@postgresql/database_name?sslmode=disable",
};

describe("keyword-value", () => {
	describe("keywordValueToUri", () => {
		for (const [input, expectedOutput] of Object.entries(TEST_CASES)) {
			it(`converts ${JSON.stringify(input)} as ${JSON.stringify(expectedOutput)}`, () => {
				const actualOutput = keywordValueToUri(input);

				assert.equal(actualOutput, expectedOutput);
			});
		}
	});
});
