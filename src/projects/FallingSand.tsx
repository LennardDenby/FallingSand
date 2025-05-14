import { useState, useEffect } from 'react';
import './FallingSand.css'

interface FallingSandProps {
    rows: number;
    cols: number;
}

function FallingSand({ rows, cols}: FallingSandProps) {
    const [grid, setGrid] = useState(createGrid(rows, cols))
    const [isMouseDown, setIsMouseDown] = useState(false)

    const handleCellClick = (row: number, col: number) => {
        const newGrid = [...grid];
        newGrid[row][col] = 1;
        setGrid(newGrid);
    }

    const handleMouseDown = () => {
        setIsMouseDown(true);
    };
    
    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    const handleCellMouseEnter = (row: number, col: number) => {
        if (isMouseDown) {
            handleCellClick(row, col);
        }
    };

    useEffect(() => {
        let intervalId: number;
        intervalId = window.setInterval(() => {
            setGrid(prevGrid => updateGrid(prevGrid))
        }, 10);
        return () => {
            window.clearInterval(intervalId);
        }
    }, []);
    
    return (
        <table
            className="sand-table"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <tbody>
                {renderGrid(grid, handleCellClick, handleCellMouseEnter)}
            </tbody>
        </table>
    )
}

function updateGrid(grid: number[][]): number[][] {
    const newGrid = [...grid]

    for (let row = newGrid.length-1; row >= 0; row--) {
        for (let col = 0; col < newGrid[0].length; col++) {
        
            if (newGrid[row][col] == 1) {
                let leftRight = getDiagonals(newGrid, row, col)
                if ((row + 1) < newGrid.length && newGrid[row + 1][col] == 0) {
                    newGrid[row][col] = 0
                    newGrid[row + 1][col] = 1
                }
                else if (leftRight[0] == 1 && leftRight[1] == 1) {
                    if (Math.random() < 0.5) {
                        newGrid[row][col] = 0
                        newGrid[row + 1][col - 1] = 1
                    } else {
                        newGrid[row][col] = 0
                        newGrid[row + 1][col + 1] = 1
                    }
                } else if (leftRight[0] == 1) {
                    newGrid[row][col] = 0
                    newGrid[row + 1][col - 1] = 1
                } else if (leftRight[1] == 1) {
                    newGrid[row][col] = 0
                    newGrid[row + 1][col + 1] = 1
                }
            }
        }
    }
    return newGrid
}

function getDiagonals(grid: number[][], row: number, col: number): number[] {
    var leftRight: number[] = [0, 0]
    if (row + 1 < grid.length) {
        if (col - 1 >= 0 && grid[row + 1][col - 1] == 0) {
            leftRight[0] = 1
        }
        if (col + 1 < grid[0].length && grid[row + 1][col + 1] == 0) {
            leftRight[1] = 1
        }
    }
    return leftRight
}

function createGrid(rows: number, cols: number): number[][] {
    const grid: number[][] = []
    for (let i = 0; i < rows; i++) {
        const row = []
        for (let j = 0; j < cols; j++) {
            row.push(0)
        }
        grid.push(row)
    }
    return grid
}
function renderGrid(
    grid: number[][],
    onCellClick: (row: number, col: number) => void,
    onCellMouseEnter: (row: number, col: number) => void
) {
    const cellSize = 500 / Math.max(grid.length, grid[0].length)
    const cellStyle = {
        width: `${cellSize}px`,
        height: `${cellSize}px`
    }

    return grid.map((row, rowIndex) => (
        <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
                <td 
                    key={colIndex} 
                    style={cellStyle} 
                    className={`sand-cell ${cell === 1 ? 'filled' : ''}`}
                    onClick={() => onCellClick(rowIndex, colIndex)}
                    onMouseEnter={() => onCellMouseEnter(rowIndex, colIndex)}
                />
            ))}
        </tr>
    ))
    
}

export default FallingSand