import { selectTileByCord as selectNode } from './board.js'

export function bfs(matrix, {x, y}) {

    let queue = {};
    let queueHead = 0;
    let queueTail = 0;

    x = parseInt(x);
    y = parseInt(y);
    enqueue({x, y});

    function enqueue(item) {
        queue[queueTail] = item;
        queueTail++;
    }
    
    function daqueue() {
        const item = queue[queueHead];
        delete queue[queueHead];
        queueHead++;
        return item;
    }

    function getNodesNotSelected({x, y}) {

        let neighbors = [];

        const push = (x, y) => {
            if( matrix?.[x] !== undefined
                && matrix?.[x][y] !== undefined
                && matrix[x][y]?.isSelected === false
            ) neighbors.push({x, y});
        };
        
        const modifier = x % 2 === 0 ? 1 : -1;
        push(x, y-1)
        push(x, y+1)
        push(x+1, y)
        push(x+1, y+modifier)
        push(x-1, y)
        push(x-1, y+modifier)
    
        return neighbors;
    }

    for(let i = queueHead; i < queueTail; i++) {
        getNodesNotSelected(daqueue()).forEach((node) => {
            selectNode(node);
            if(matrix[node.x][node.y]?.value === 0) enqueue(node);
        });
    }

}

export function dfs(matrix, {x, y}) {

}