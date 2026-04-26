export function validateHabitName(name:string):{ value: string; valid:boolean; error:string | null }{
    const value = name.trim();

    if(!value){
        return{
            value: '',
            valid: false,
            error: 'Habit name is required',
        };
    }

    if (value.length > 60) {
        return{
            value,
            valid: false,
            error: 'Habit name must be 60 characters or fewer'
        }
    }

    return {
        value: value,
        valid: true,
        error: null
    }
}