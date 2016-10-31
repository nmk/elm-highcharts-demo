var _nmk$elm_highcharts_demo$Native_Chart = function() {
  var drawLineChart = function(node, chartData) {
    var containerWidth = node.offsetWidth;

    return new window.Highcharts.chart(node, {
      chart: {
        animation: false,
        backgroundColor: '#fff'
      },
      title: {
        text: chartData.title
      },
      plotOptions: {
        series: {
          animation: false
        }
      },
      xAxis: {
        type: 'datetime'
      },
      series: chartData.series
    });
  };


  var initialModel = function(){
    return { state: null };
  };

  var extractModel = function(factList) {
    var model = initialModel();
    var kid = factList;

    while (kid.ctor != "[]") {
      var payload = kid._0;
      switch (payload.key) {
      case "data":
        model.data = payload.value;
        break;
      }
      kid = kid._1;
    }
    return model;
  };

  function toHtml(factList, skipChildren) {
    var model = extractModel(factList);
    return _elm_lang$virtual_dom$Native_VirtualDom.custom(factList, model, implementation);
  }

  var implementation = {
    render: render,
    diff: diff
  };

  function render(model) {
    console.log("rendering initial chart");

    var state = { chart: null };

    var div = document.createElement('div');

    requestAnimationFrame(function(){
      state.chart = drawLineChart(div, model.data);
    });

    var dummy = initialModel();
    dummy.state = state;
    diff({ model: dummy }, { model: model });

    return div;
  }

  function diff(prev, next) {
    var prevModel = prev.model,
        newModel = next.model,
        state = prevModel.state,
        prevChart = state.chart;

    if(prevChart) {
      console.log("redrawing chart");

      var presentSeriesIds = prevChart.series.map(function(s){ return s.options.id; }),
          newSeries = newModel.data.series,
          newSeriesIds = newSeries.map(function(s){ return s.id; });

      // remove series not in new chart
      for (var i = 0; i < presentSeriesIds.length; i++) {
        var id = presentSeriesIds[i];
        if (newSeriesIds.indexOf(id) === -1) {
          prevChart.get(id).remove(false);
        }
      }

      // update existing or add new series
      for (var j = 0; j < newSeries.length; j++) {
        var series = newSeries[j],
              prevSeries = prevChart.get(series.id);

        if (prevSeries) {
          if (prevSeries.options.name != series.name || prevSeries.options.index != series.index) {
            prevSeries.update(series);
          } else {
            prevSeries.setData(series.data, false, false);
          }
        } else {
          prevChart.addSeries(series, false, false);
        }
      }
      prevChart.redraw();
    }

    newModel.state = state;

    return null;
  }

  return {
    toHtml: F2(toHtml)
  };
}();
