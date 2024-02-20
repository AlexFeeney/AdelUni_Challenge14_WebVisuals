// Use D3 library to read samples.json
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {

    // Initialize function to create bar chart
    function init() {
        // Select dropdown menu
        var dropdownMenu = d3.select("#selDataset");

        // Append options to dropdown menu
        data.names.forEach(function(name) {
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // Use the first sample to build initial plots
        var initialSample = data.names[0];
        buildCharts(initialSample);
        displayMetadata(initialSample);
        buildGauge(initialSample);
       
       
    }

    // Function to build charts
    function buildCharts(sample) {
        // Filter data for the selected sample
        var selectedSample = data.samples.find(function(element) {
            return element.id === sample;
        });

        // Slice data to get top 10 values, labels, and hovertext for the bar chart
        var top10Values = selectedSample.sample_values.slice(0, 10).reverse();
        var top10Labels = selectedSample.otu_ids.slice(0, 10).map(function(id) {
            return "OTU " + id;
        }).reverse();
        var top10Hovertext = selectedSample.otu_labels.slice(0, 10).reverse();

        // Create horizontal bar chart
        var trace1 = {
            x: top10Values,
            y: top10Labels,
            text: top10Hovertext,
            type: "bar",
            orientation: "h"
        };

        var dataBar = [trace1];

        var layoutBar = {
            title: "Top 10 OTUs",
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU ID" }
        };

        Plotly.newPlot("bar", dataBar, layoutBar);

        // Build bubble chart
        var trace2 = {
            x: selectedSample.otu_ids,
            y: selectedSample.sample_values,
            text: selectedSample.otu_labels,
            mode: "markers",
            marker: {
                size: selectedSample.sample_values,
                color: selectedSample.otu_ids
            }
        };

        var dataBubble = [trace2];

        var layoutBubble = {
            title: "OTU Bubble Chart",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Values" }
        };

        Plotly.newPlot("bubble", dataBubble, layoutBubble);
    }

    // Function to display sample metadata
    function displayMetadata(sample) {
        // Filter data for the selected sample
        var selectedMetadata = data.metadata.find(function(element) {
            return element.id.toString() === sample;
        });

        // Select the metadata div
        var metadataDiv = d3.select("#sample-metadata");

        // Clear any existing metadata
        metadataDiv.html("");

        // Loop through each key-value pair in the metadata and append to the div
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataDiv.append("p").text(`${key}: ${value}`);
        });
    }

    // Function to build gauge chart
    function buildGauge(sample) {
        // Filter data for the selected sample
        var selectedMetadata = data.metadata.find(function(element) {
            return element.id.toString() === sample;
        });

        // Get washing frequency for the gauge chart
        var washFrequency = selectedMetadata.wfreq;

        // Create gauge chart
        var dataGauge = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: washFrequency,
            title: { text: "Belly Button Washing Frequency<br>Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                steps: [
                    { range: [0, 1], color: "#f7f7f7" },
                    { range: [1, 2], color: "#e5f5e0" },
                    { range: [2, 3], color: "#c7e9c0" },
                    { range: [3, 4], color: "#a1d99b" },
                    { range: [4, 5], color: "#74c476" },
                    { range: [5, 6], color: "#41ab5d" },
                    { range: [6, 7], color: "#238b45" },
                    { range: [7, 8], color: "#006d2c" },
                    { range: [8, 9], color: "#00441b" }
                ],
                threshold: {
                    line: { color: "red", width: 4 },
                    thickness: 0.75,
                    value: washFrequency
                }
            }
        }];

        var layoutGauge = { width: 600, height: 450, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', dataGauge, layoutGauge);
    }

    // Call the init function to initialize the page
    init();
    // Function to update all plots when a new sample is selected
    function optionChanged(newSample) {
        buildCharts(newSample);
        displayMetadata(newSample);
        buildGauge(newSample);
    }

});
