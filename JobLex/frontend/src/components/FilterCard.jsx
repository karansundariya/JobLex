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

    // Filter card logic improved again
    useEffect(() => {
        dispatch(setFilters(filters));
    }, [filters]);

    const clearAll = () => {
        setLocalFilters({ location: '', industry: '', salary: '' });
    };

    return (
        <div className='w-full bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between mb-4'>
                <h1 className='font-bold text-lg sm:text-xl'>Filter Jobs</h1>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                    className="text-sm px-3 py-1"
                >
                    Clear All
                </Button>
            </div>
            
            <div className='space-y-6'>
                {filterData.map((data, index) => (
                    <div key={data.filterType} className='border-b border-gray-100 pb-4 last:border-b-0'>
                        <h2 className='font-semibold text-base sm:text-lg mb-3 text-gray-800'>{data.label}</h2>
                        <RadioGroup value={filters[data.filterType]} className='space-y-2'>
                            {data.array.map((item, idx) => {
                                const itemId = `id${index}-${idx}`;
                                return (
                                    <div className='flex items-center space-x-3' key={itemId}>
                                        <RadioGroupItem
                                            value={item}
                                            id={itemId}
                                            checked={filters[data.filterType] === item}
                                            onClick={() => toggleHandler(data.filterType, item)}
                                            readOnly
                                            className='w-5 h-5'
                                        />
                                        <Label 
                                            htmlFor={itemId} 
                                            className='text-sm sm:text-base cursor-pointer flex-1 py-2 hover:text-blue-600 transition-colors'
                                        >
                                            {item}
                                        </Label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    </div>
                ))}
            </div>
            
            {/* Mobile-friendly action buttons */}
            <div className='mt-6 pt-4 border-t border-gray-100'>
                <Button
                    variant="outline"
                    onClick={clearAll}
                    className="w-full py-3 text-base font-medium"
                >
                    Clear All Filters
                </Button>
            </div>
        </div>
    );
}

export default FilterCard