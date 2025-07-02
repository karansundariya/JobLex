import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setFilters } from '@/redux/jobSlice'
import { Button } from './ui/button'

const filterData = [
    {
        filterType: "location",
        label: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: "industry",
        label: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        filterType: "salary",
        label: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
]

const FilterCard = () => {
    const [filters, setLocalFilters] = useState({
        location: '',
        industry: '',
        salary: ''
    });
    const dispatch = useDispatch();

    const changeHandler = (type, value) => {
        setLocalFilters(prev => ({ ...prev, [type]: value }));
    };

    const toggleHandler = (type, value) => {
        setLocalFilters(prev => ({
            ...prev,
            [type]: prev[type] === value ? '' : value
        }));
    };

    // Filter card logic updated
    useEffect(() => {
        dispatch(setFilters(filters));
    }, [filters]);

    const clearAll = () => {
        setLocalFilters({ location: '', industry: '', salary: '' });
    };

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            {filterData.map((data, index) => (
                <div key={data.filterType}>
                    <h1 className='font-bold text-lg'>{data.label}</h1>
                    <RadioGroup value={filters[data.filterType]}>
                        {data.array.map((item, idx) => {
                            const itemId = `id${index}-${idx}`;
                            return (
                                <div className='flex items-center space-x-2 my-2' key={itemId}>
                                    <RadioGroupItem
                                        value={item}
                                        id={itemId}
                                        checked={filters[data.filterType] === item}
                                        onClick={() => toggleHandler(data.filterType, item)}
                                        readOnly
                                    />
                                    <Label htmlFor={itemId}>{item}</Label>
                                </div>
                            );
                        })}
                    </RadioGroup>
                </div>
            ))}
            <Button
                variant="outline"
                className="mt-2"
                onClick={clearAll}
            >
                Clear All
            </Button>
        </div>
    );
}

export default FilterCard