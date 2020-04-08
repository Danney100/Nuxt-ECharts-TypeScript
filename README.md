# Visualization Sandbox
This sandbox is a minimal environment for developing visualizations that follows the standard Nuxt.js folder structure. 

## Installation

I recommend installing everything with yarn as I have seen npm leading to image files, icon fonts missing, etc. for some reason. So please install yarn with npm install -g yarn and then run the following commands:  
```
git submodule update
yarn install
yarn run dev
```
  
## Essential links
https://datavizcatalogue.com - Excellent reference/exploratory page for how data can map to use cases, explanations of chart types, etc.  
https://www.echartsjs.com/en/option.html#title - this will be your goto for pretty much anything chart related.  
https://www.echartsjs.com/examples/en/index.html - most charts copy-and-paste many elements from these examples; I encourage the same for charts that are very similar to the desired end result.  
https://github.com/nuxt-community/nuxt-property-decorator - library for class-based Components in Nuxt.js
https://github.com/ecomfe/vue-echarts - Vue ECharts library  
  
## Developing a Visualization
Visualization development typically involves a rapid prototyping-oriented approach to development rather than a tests-first oriented approach with say TDD or BDD. What is most important is getting the most done you can quickly, because there may be some surprises along the way that are important to know early on. It is somewhat common that a single requirement for a visualization could completely change how the chart is rendered or the data represented. For instance, a requirement of having multiple series instead could complicate procedures such as data filtering, data selection, and more. So, it's important to try to implement the basics of all requirements before more rigorous testing approaches begin, as the behavior of the visualization may change very quickly from initial prototypes.  
  
To start developing a visualization, you will simply create a component in components/app/visualizations in either the charts/ or custom/ folder. custom/ is for more complex visualizations, charts/ is for simple things like Bar charts, pie charts, etc.; charts that any standard graphing framework would have. Afterwards simply import the visualization's Component in pages/admin/index.vue and insert it into the page to start playing around with it.  
  
You should start by developing the base functionality with a static test data set. It is OK to commit and push W.I.P visualizations utilizing static data. Figure out the formatting of the data and how it maps to the visualization, what mutations need to be done on the data, etc. Figure out the visual display of the visualization as well as any changes to the graphic which may be happening (zooming, panning, selection, etc.)  
  
Once the base functionality is in a workable prototype state with static test data, the next step would be to hook it to real, dynamic data coming from our API. The test data will come from our backend team and so will the API call. In this phase, your responsibility is to parameterize all things possible: X, Y, & Z dimensions should be configurable; data fields should not be hardcoded, and implement basic customization of the chart. Figure out how to make the customizations for the visualization representable within JSON, and write type definitions for these configurations. You should also communicate about what API calls are needed and document the functionality of what the visualization is querying throughout your code.  
  
You will need to create a constructor function with a default base config in client/store/visualization/factory.ts. Type definitions for visualizations are added in types/visualization-framework.ts. Customization of the chart by the user is implemented within two separate forms. Within client/components/app/Visualization/crud/edit there are edit forms for all of the Charts. These forms contain editable inputs that sync to a visualization's chart state. You will add these forms into components/app/Visualization/VisualizationEditor.vue under the chart preview in the div that precedes the form tabs. There are two tabs: one for the generic visualization settings that apply to every visualization, and one for the visualization-specific settings controlling things like dimensions, legends, etc.
  
It is important to test the creation and modification flow of the Visualization from start to finish from the user'sperspective, as no part of the flow should be broken.