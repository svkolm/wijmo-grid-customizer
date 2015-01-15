angular.module('wijGridCustomizerService', [])

  .factory('wijGridCustomizer', function() {
    return function(dataView) {
      return {
        cellStyleFormatter: function(args) {
          customizeBooleanColumn(args);
        },
        loaded: function(e) {
          customizeFooter(e);
        }
      };

      function customizeBooleanColumn(args) {
        if ((args.row.state & wijmo.grid.renderState.rendering)) {
          if (args.column.dataType === 'boolean') {
            var innerCell = args.$cell.children('.wijmo-wijgrid-innercell'),
              dataKey = args.column.dataKey;

            if ((args.row.type & wijmo.grid.rowType.header)) {
              innerCell.css('text-align', 'center');

              if (!args.column.readOnly) {
                var headerText = innerCell.children('.wijmo-wijgrid-headertext');
                headerText.css('cursor', 'pointer');
                headerText.click(function() {
                  for (var i = 0; i < dataView.count(); i++) {
                    dataView.setProperty(i, dataKey, true);
                  }
                  dataView.refresh();
                });
              }
            }
            else if ((args.row.type & wijmo.grid.rowType.data)) {
              innerCell.wrapInner('<div class="czr-checkbox"></div>');
              var checkBox = innerCell.children('.czr-checkbox');

              checkBox.wrapInner('<label></label>');
              var label = checkBox.children('label');
              label.addClass('czr-checkbox-label');

              var input = label.children('input'),

                check = function() {
                  if (input.prop('checked')) {
                    label.addClass('czr-checkbox-checked');
                  }
                  else {
                    label.removeClass('czr-checkbox-checked');
                  }
                };

              input.addClass('czr-checkbox-input');
              if (!args.column.readOnly) {
                label.css('cursor', 'pointer');
                input.change(function() {
                  args.row.data[dataKey] = input.prop('checked');
                  check();
                });
              }
              check();
            }
          }
        }
      }

      function customizeFooter(e) {
        var footer = $(e.target).siblings('.wijmo-wijgrid-footer');

        footer.wrapInner('<div class="czr-pager-btn-bl"></div>')

          .prepend('<button class="czr-prev-btn">Previous</button>')
          .children('.czr-prev-btn').click(function() {
            dataView.prevPage();
          });

        var from = dataView.pageSize() * dataView.pageIndex() + 1,
          to = from + dataView.count() - 1;
        footer.prepend('<span>' + 'Showing ' + ds(from) + '-' + ds(to)
          + ' of ' + ds(dataView.totalItemCount()) + '</span>')

          .append('<button class="czr-next-btn">Next</button>')
          .children('.czr-next-btn').click(function() {
            dataView.nextPage();
          });

        footer.wrapInner('<div class="czr-pager-right-bl"></div>')

          .prepend('<button class="czr-go2page-btn">Go</button>')
          .prepend('<input class="czr-go2page-input" />')
          .prepend('<span>Go to Page</span>')
          .children('.czr-go2page-btn').click(function() {
            var page = footer.children('.czr-go2page-input').val();
            if (page >= 1 && page <= dataView.pageCount()) {
              dataView.pageIndex(page - 1);
            }
          });
      }

      function ds(n) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
    }
  });
