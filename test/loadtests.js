// Create a Webpack require context so we can dynamically require our 
// project's modules. Exclude test files in this context. 
var projectContext = require.context('../src', true, /.js$/);

// Extract the module ids that Webpack uses to track modules. 
var projectModuleIds = projectContext.keys().map(module => String( projectContext.resolve(module) ));

beforeEach(() => {
    // Remove our modules from the require cache before each test case. This is super important because
    // Flux stores are singletons with state!
    projectModuleIds.forEach(id => delete require.cache[id]);
});

// Load each test using webpack's dynamic require context
var testsContext = require.context('.', true, /(.spec\.js$)|(Helper\.js$)/);
testsContext.keys().forEach(testsContext);
