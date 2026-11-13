import assert from "node:assert/strict";
import { test } from "node:test";
import {
  experimentFromContentId,
  investigationHref,
  parseExperimentContext,
  researchHref,
  updateSearchParam,
  updateSearchParams,
} from "./research-context.ts";

test("parses supported investigation context and handles invalid or absent IDs", () => {
  assert.deepEqual(parseExperimentContext(""), { status: "absent" });

  for (const experiment of ["FLEX", "BASS-II", "SAFFIRE-I"] as const) {
    assert.deepEqual(parseExperimentContext(`?experiment=${experiment}`), {
      status: "valid",
      experiment,
    });
  }

  assert.deepEqual(parseExperimentContext("?experiment=unknown"), {
    status: "invalid",
    value: "unknown",
  });
});

test("maps investigation page IDs and builds existing route links", () => {
  assert.equal(experimentFromContentId("flex"), "FLEX");
  assert.equal(experimentFromContentId("bass"), "BASS-II");
  assert.equal(experimentFromContentId("saffire"), "SAFFIRE-I");
  assert.equal(investigationHref("FLEX"), "/flex#data-explorer");
  assert.equal(investigationHref("BASS-II"), "/bass-ii#data-explorer");
  assert.equal(investigationHref("SAFFIRE-I"), "/saffire#explorer");
  assert.equal(researchHref("compare", "FLEX"), "/compare?experiment=FLEX&dataset=FLEX");
  assert.equal(researchHref("compare", "SAFFIRE-I"), "/compare?experiment=SAFFIRE-I");
  assert.equal(researchHref("research", "BASS-II"), "/research?experiment=BASS-II");
  assert.equal(researchHref("ask", "SAFFIRE-I"), "/ask?experiment=SAFFIRE-I");
});

test("updates one URL parameter without dropping other context or filters", () => {
  assert.equal(
    updateSearchParam("?experiment=FLEX&variable=oxygen", "dataset", "BASS-II"),
    "?experiment=FLEX&variable=oxygen&dataset=BASS-II",
  );
  assert.equal(
    updateSearchParam("?experiment=FLEX&variable=oxygen", "experiment", null),
    "?variable=oxygen",
  );
  assert.equal(
    updateSearchParams("?experiment=FLEX&variable=burnTime", [
      ["dataset", "BASS-II"],
      ["experiment", "BASS-II"],
      ["variable", "finalOxygen"],
    ]),
    "?experiment=BASS-II&variable=finalOxygen&dataset=BASS-II",
  );
});
