var freshGrid = function (rows, cols) {
        var $table = $("<table/>");
//        $table.html("");

        for (var row = 0; row < rows; row++) {
            $table.append(getNewRow(cols));
        }

return $table;

    };

   var getNewRow = function (cols) {
        var $row = $("<tr/>");
        for (var col = 0; col < cols; col++) {
            $row.append(getNewCol());
        }
        return $row;
    };

    var getNewCol = function () {
        return $("<td/>", {
                                "class": 'unknown'
                                });
    };


var setCell = function(grid, row, col, clasz) {

console.log(grid+ " tr:eq("+(row)+") td:eq("+(col)+")");
$(grid+ " tr:eq("+(row)+") td:eq("+(col)+")").removeClass();
    $(grid+ " tr:eq("+(row)+") td:eq("+(col)+")").addClass(clasz);
};

$("#grid-opponent").append(freshGrid(10,10));
$("#grid-shoot").append(freshGrid(10,10));

setCell("#grid-shoot", 0,0, "empty");
setCell("#grid-shoot", 0,1, "empty");
setCell("#grid-shoot", 0,2, "empty");
setCell("#grid-shoot", 0,3, "empty");

setCell("#grid-shoot", 1,0, "ship");
setCell("#grid-shoot", 1,1, "ship");
setCell("#grid-shoot", 1,2, "ship");
setCell("#grid-shoot", 1,3, "ship");