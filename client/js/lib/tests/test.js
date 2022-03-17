/*Test astar pathfinding functions*/
const AStar = require('./astar').AStar;

function printPathOnGrid(grid, path) {
    str_to_print = 'Printing path on grid\n';
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            //Iterate through the path and mark the path cells with '*'
            found = false;
            for (let k = 0; k < path.length; k++) {
                if (path[k][0] == j && path[k][1] == i) {
                    str_to_print += '*';
                    found = true;
                    break;
                }
            }
            //If the cell is not part of the path, mark it with '.'
            if (!found) {
                str_to_print += grid[i][j];
            }
        }
        str_to_print += '\n';
    }
    console.log(str_to_print);
}



/*Test 1: Test empty euclidean distance*/
test("Test 1: Test simple path using euclidean distance", function() {
    let grid = [];
    for (let i = 0; i < 10; i++) {
        grid[i] = [];
        for (let j = 0; j < 10; j++) {
            grid[i][j] = 0;
        }
    }

    let start = [0, 0];
    let end = [9, 9];
    let path = AStar(grid, start, end, "Euclidean");

    
    expect(path).toEqual(
        [
            [ 0, 0 ], [ 1, 1 ],
            [ 2, 2 ], [ 3, 3 ],
            [ 4, 4 ], [ 5, 5 ],
            [ 6, 6 ], [ 7, 7 ],
            [ 8, 8 ], [ 9, 9 ]
        ]
    );
});

/*Test 2: Test empty manhattan distance*/
test("Test 2: Test simple path using manhattan distance", function() {
    let grid = [];
    for (let i = 0; i < 10; i++) {
        grid[i] = [];
        for (let j = 0; j < 10; j++) {
            grid[i][j] = 0;
        }
    }

    let start = [0, 0];
    let end = [9, 9];
    let path = AStar(grid, start, end, "Manhattan");

    expect(path).toEqual(
        [
            [ 0, 0 ], [ 1, 0 ], [ 2, 0 ],
            [ 3, 0 ], [ 4, 0 ], [ 5, 0 ],
            [ 6, 0 ], [ 7, 0 ], [ 8, 0 ],
            [ 9, 0 ], [ 9, 1 ], [ 9, 2 ],
            [ 9, 3 ], [ 9, 4 ], [ 9, 5 ],
            [ 9, 6 ], [ 9, 7 ], [ 9, 8 ],
            [ 9, 9 ]
          ]
    );
});

/*Test 3: Test empty diagonal distance*/
test("Test 3: Test simple path using diagonal distance", function() {
    let grid = [];
    for (let i = 0; i < 10; i++) {
        grid[i] = [];
        for (let j = 0; j < 10; j++) {
            grid[i][j] = 0;
        }
    }

    let start = [0, 0];
    let end = [9, 9];
    let path = AStar(grid, start, end, "Diagonal");

    printPathOnGrid(grid, path);
    
    expect(path).toEqual(
        [
            [ 0, 0 ], [ 1, 1 ],
            [ 2, 2 ], [ 3, 3 ],
            [ 4, 4 ], [ 5, 5 ],
            [ 6, 6 ], [ 7, 7 ],
            [ 8, 8 ], [ 9, 9 ]
        ]
    );
});

/*Test 4: Test empty euclidean free distance*/
test("Test 4: Test simple path using euclidean free distance", function() {
    let grid = [];
    for (let i = 0; i < 10; i++) {
        grid[i] = [];
        for (let j = 0; j < 10; j++) {
            grid[i][j] = 0;
        }
    }

    

    let start = [0, 0];
    let end = [9, 9];
    let path = AStar(grid, start, end, "EuclideanFree");

    printPathOnGrid(grid, path);

    
    expect(path).toEqual(
        [
            [ 0, 0 ], [ 1, 1 ],
            [ 2, 2 ], [ 3, 3 ],
            [ 4, 4 ], [ 5, 5 ],
            [ 6, 6 ], [ 7, 7 ],
            [ 8, 8 ], [ 9, 9 ]
        ]
    );
});

/*Test 5: Test empty diagonal free distance*/
test("Test 5: Test simple path using diagonal free distance", function() {
    let grid = [];
    for (let i = 0; i < 10; i++) {
        grid[i] = [];
        for (let j = 0; j < 10; j++) {
            grid[i][j] = 0;
        }
    }

    

    let start = [0, 0];
    let end = [9, 9];
    let path = AStar(grid, start, end, "DiagonalFree");

    
    expect(path).toEqual(
        [
            [ 0, 0 ], [ 1, 1 ],
            [ 2, 2 ], [ 3, 3 ],
            [ 4, 4 ], [ 5, 5 ],
            [ 6, 6 ], [ 7, 7 ],
            [ 8, 8 ], [ 9, 9 ]
        ]
    );
});

/* Test 6: Test path with obstacles euclidean*/
test("Test 6: Test path with obstacles using euclidean distance", function() {
    let grid = [];
    for (let i = 0; i < 10; i++) {
        grid[i] = [];
        for (let j = 0; j < 10; j++) {
            grid[i][j] = 0;
        }
    }

    grid[1][1] = 1;
    grid[2][2] = 1;
    grid[3][3] = 1;
    grid[4][4] = 1;
    grid[5][5] = 1;
    grid[6][6] = 1;
    grid[7][7] = 1;
    grid[8][8] = 1;
    grid[3][4] = 1;
    grid[5][3] = 1;

    let start = [0, 0];
    let end = [9, 9];
    let path = AStar(grid, start, end, "Euclidean");

    printPathOnGrid(grid, path);

    console.log(path);  
    
    expect(path).toEqual(
        [
            [ 0, 0 ], [ 1, 0 ],
            [ 2, 0 ], [ 3, 1 ],
            [ 4, 2 ], [ 5, 2 ],
            [ 6, 3 ], [ 7, 4 ],
            [ 7, 5 ], [ 8, 6 ],
            [ 9, 7 ], [ 9, 8 ],
            [ 9, 9 ]
          ]
    );
});

/* Test 7: Test path with obstacles manhattan*/
test("Test 7: Test path with obstacles using manhattan distance", function() {
    let grid = [];
    for (let i = 0; i < 10; i++) {
        grid[i] = [];
        for (let j = 0; j < 10; j++) {
            grid[i][j] = 0;
        }
    }

    grid[1][1] = 1;
    grid[2][2] = 1;
    grid[3][3] = 1;
    grid[4][4] = 1;
    grid[5][5] = 1;
    grid[6][6] = 1;
    grid[7][7] = 1;
    grid[8][8] = 1;
    grid[3][4] = 1;
    grid[5][3] = 1;

    let start = [0, 0];
    let end = [9, 9];
    let path = AStar(grid, start, end, "Manhattan");

    printPathOnGrid(grid, path);

    console.log(path);  
    
    expect(path).toEqual(
        [
            [ 0, 0 ], [ 1, 0 ], [ 2, 0 ],
            [ 3, 0 ], [ 4, 0 ], [ 5, 0 ],
            [ 6, 0 ], [ 7, 0 ], [ 8, 0 ],
            [ 9, 0 ], [ 9, 1 ], [ 9, 2 ],
            [ 9, 3 ], [ 9, 4 ], [ 9, 5 ],
            [ 9, 6 ], [ 9, 7 ], [ 9, 8 ],
            [ 9, 9 ]
          ]
    );
});

/* Test 8: Test path with obstacles diagonal*/
test("Test 8: Test path with obstacles using diagonal distance", function() {
    let grid = [];
    for (let i = 0; i < 10; i++) {
        grid[i] = [];
        for (let j = 0; j < 10; j++) {
            grid[i][j] = 0;
        }
    }

    grid[1][1] = 1;
    grid[2][2] = 1;
    grid[3][3] = 1;
    grid[4][4] = 1;
    grid[5][5] = 1;
    grid[6][6] = 1;
    grid[7][7] = 1;
    grid[8][8] = 1;
    grid[3][4] = 1;
    grid[5][3] = 1;

    let start = [0, 0];
    let end = [9, 9];
    let path = AStar(grid, start, end, "Diagonal");

    printPathOnGrid(grid, path);

    console.log(path);  
    
    expect(path).toEqual(
        [
            [ 0, 0 ], [ 1, 0 ],
            [ 2, 0 ], [ 3, 1 ],
            [ 4, 2 ], [ 5, 2 ],
            [ 5, 3 ], [ 6, 4 ],
            [ 7, 5 ], [ 8, 6 ],
            [ 9, 7 ], [ 9, 8 ],
            [ 9, 9 ]
          ]
    );
});

/* Test 9: Test path with obstacles diagonal free*/
test("Test 9: Test path with obstacles using diagonal free distance", function() {
    let grid = [];
    for (let i = 0; i < 10; i++) {
        grid[i] = [];
        for (let j = 0; j < 10; j++) {
            grid[i][j] = 0;
        }
    }

    grid[1][1] = 1;
    grid[2][2] = 1;
    grid[3][3] = 1;
    grid[4][4] = 1;
    grid[5][5] = 1;
    grid[6][6] = 1;
    grid[7][7] = 1;
    grid[8][8] = 1;
    grid[3][4] = 1;
    grid[5][3] = 1;

    let start = [0, 0];
    let end = [9, 9];
    let path = AStar(grid, start, end, "DiagonalFree");

    printPathOnGrid(grid, path);

    console.log(path);  
    
    expect(path).toEqual(
        [
            [ 0, 0 ], [ 0, 1 ],
            [ 1, 2 ], [ 2, 3 ],
            [ 3, 4 ], [ 4, 5 ],
            [ 5, 6 ], [ 6, 7 ],
            [ 7, 8 ], [ 8, 9 ],
            [ 9, 9 ]
          ]
    );
});