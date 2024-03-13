const fs = require("fs");
const yaml = require("yaml");
const path = require("path");
const $RefParser = require("@apidevtools/json-schema-ref-parser");
const logger = require("../utils/logger");

class ConfigLoader {
  constructor() {
    this.config = null;
  }

  async init() {
    try {
      const fileName = this.getYAMLFileNameBasedOnProtocol(
        process.env.PROTOCOL
      );

      const config = yaml.parse(
        fs.readFileSync(path.join(__dirname, fileName), "utf8")
      );

      const schema = await $RefParser.dereference(config);

      this.config = schema;

      // logger.info(">", schema);
      return schema;
    } catch (e) {
      throw new Error(e);
    }
  }

  getConfig() {
    return this.config;
  }

  getYAMLFileNameBasedOnProtocol(protocol) {
    switch (protocol) {
      case "mobility":
        return "mob.yaml";
      case "fis":
        return "fis.yaml";
    }
  }

  getConfigBasedOnFlow(flowId) {
    let filteredInput = null;
    let filteredCalls = null;
    let filteredDomain = null;
    let filteredSessiondata = null;
    let filteredAdditionalFlows = null;
    let filteredsummary = "";

    this.config.flows.forEach((flow) => {
      if (flow.id === flowId) {
        const { input, calls, domain, sessionData, additioalFlows, summary } =
          flow;
        filteredInput = input;
        filteredCalls = calls;
        filteredDomain = domain;
        filteredSessiondata = sessionData;
        filteredAdditionalFlows = additioalFlows || [];
        filteredsummary = summary;
      }
    });

    return {
      filteredCalls,
      filteredInput,
      filteredDomain,
      filteredSessiondata,
      filteredAdditionalFlows,
      filteredsummary,
    };
  }

  getListOfFlow() {
    return this.config.flows
      .map((flow) => {
        if (flow.shouldDispaly) return { key: flow.summary, value: flow.id };
      })
      .filter((flow) => flow);
  }
}

const configLoader = new ConfigLoader();

module.exports = { configLoader };
