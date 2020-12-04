function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text("ID: " + result.id)
    PANEL.append("h6").text("ETHNICITY: " + result.ethnicity)
    PANEL.append("h6").text("GENDER: " + result.gender)
    PANEL.append("h6").text("AGE: " + result.age)
    PANEL.append("h6").text("LOCATION: " + result.location)
    PANEL.append("h6").text("BBTYPE: " + result.bbtype)
    PANEL.append("h6").text("WFREQ: " + result.wfreq)
    
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let patient = samples.filter(patient => patient.id === sample)
    //  5. Create a variable that holds the first sample in the array.
    let patientData = patient[0];
    //

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = patientData.otu_ids;
    let otu_labels = patientData.otu_labels;
    let sample_values = patientData.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.map(id => "OTU" + id).slice(0,10).reverse();
    var xticks = sample_values.slice(0,10).reverse();
    var text = otu_labels.slice(0,10).reverse();
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xticks,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: text
    }];
  
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacterial Cultures Found",
      xaxis: { title: "Quantity"},
      yaxis: { title: "OTU IDS"}
     };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.

    var bubbleTrace = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacterial Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
      margin: 40,
      length: 400,
      height: 600
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);

    //Get patient metadata
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var wash_frequency = result.wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wash_frequency,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "Belly Button Washing Frequency" },
      gauge: {
        axis: { range: [0, 10] },
        bar: { color: "darkblue" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "green" },
          { range: [8, 10], color: "blue" }
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500,
      height: 500,
      paper_bgcolor: "white",
      font: { color: "black", family: "Arial" }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}



