// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: "",
        frameworks: ["jasmine", "@angular-devkit/build-angular"],
        plugins: [
            require("karma-jasmine"),
            require("karma-chrome-launcher"),
            require("karma-jasmine-html-reporter"),
            require("karma-coverage"),
            require("@angular-devkit/build-angular/plugins/karma")
        ],
        client: {
            jasmine: {},
            clearContext: false
        },
        jasmineHtmlReporter: {
            suppressAll: true
        },
        coverageReporter: {
            dir: require("path").join(__dirname, "./coverage/analyst"),
            subdir: ".",
            reporters: [{ type: "html" }, { type: "text-summary" }]
        },
        reporters: ["progress", "kjhtml"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ["ChromeHeadless"],
        // for containers and CI runners, where Chrome's sandbox is unavailable (npm run test:ci)
        customLaunchers: {
            ChromeHeadlessNoSandbox: { base: "ChromeHeadless", flags: ["--no-sandbox"] }
        },
        singleRun: true,
        restartOnFileChange: false
    });
};
