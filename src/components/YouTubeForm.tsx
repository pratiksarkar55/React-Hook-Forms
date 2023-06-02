import React, { useEffect } from 'react'
import {useForm,useFieldArray, FieldErrors} from 'react-hook-form'
import {DevTool} from "@hookform/devtools"

let renderCount = 0; // in strict mode react renders the component twice during developmemnt.READ THE ARTICLE.

type FormValues = {
  username: string
  email: string
  channel: string
  social:{
    twitter: string
    facebook: string
  }
  phone:string[];
  phNumbers:{
    number: string
  }[];
  age:number;
  dob:Date;
}

export default function YouTubeForm() {

  const form =  useForm<FormValues>({
    defaultValues : {
      username:"Pratik",
      email:"",
      channel:"",
      social:{
        twitter: "wwww.twitter.com",
        facebook:"wwww.facebook.com"
      },
      phone:['',''],
      phNumbers:[{number:''}],
      age:0,
      dob:new Date()
    }

    // defaultValues : async ()=>{
    //     const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    //     const data = await response.json();
    //     return {
    //      username:data.username,
    //      email:data.email,
    //      channel:""
    //     }
    // }
  });
  const {register,control,handleSubmit,formState,watch,setValue,getValues,reset} = form;

  useEffect(()=>{
 const watchSubscribe = watch((value)=>{
   //console.log(value);
  return ()=>{
    watchSubscribe.unsubscribe();
  }
  })
  },[watch])
 // const {name,onBlur,onChange,ref} = register("username");
 const {errors,touchedFields,dirtyFields,isDirty,isValid,isSubmitting,isSubmitted,isSubmitSuccessful,submitCount} = formState;
 console.log(touchedFields,dirtyFields,isDirty,isValid);

 console.log(isSubmitting); // true while submitting false afterwards
 console.log(isSubmitted); // true after submission and reamins true unless refrshed.
 console.log(isSubmitSuccessful);// true if all validations passes after submission
 console.log(submitCount); // numer of submissions
 renderCount++;

 const {fields,append,remove} = useFieldArray({
  name:"phNumbers",
  control
 })

 const onSubmit = (data:FormValues)=>{
  //console.log("Form submitted",data);
 }

 const handleSetValue=()=>{
   setValue("username","Roni",{
    shouldDirty: true,
    shouldValidate: true,
    shouldTouch:true
   })
 }

  const handleGetValue=()=>{
   //console.log(getValues(["username", "email"]));
 }

 //const watchList = watch(["username","email"]);


 const onError = (err:FieldErrors<FormValues>)=>{
  console.log("errors are",err);
 }

  return (
    <div>
      {/* Rendercount is rendered only once(2 times while in developmemnt).So there's no re-render on formstate update */}
      COunt is {renderCount/2} 
    {/* //   <div>WatchList : {watchList}</div> */}
       <form onSubmit={handleSubmit(onSubmit,onError)} noValidate>
        <label htmlFor='username'>UserName</label>
        <input type='text' id='username' {...register("username",{
          required:"Username is required",
          // disabled:true
        })} />
        <p>{errors.username?.message}</p>
        <label htmlFor='email'>Email</label>
        <input type='email' id='email' {...register("email",{
          required:"Email is required",
          pattern:{
            value:/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            message:"Invalid email format"
          },
          validate:{
            notAdmin:(fieldValue)=>{
               return fieldValue!=="admin@gmail.com" || "Enter a different email address"
            },
            blackListedEmail:(fieldValue)=>{
               return fieldValue.endsWith(".com") || "Email should end with .com"
            },

          }
        })} />
        <p>{errors.email?.message}</p>
        <label htmlFor='channel'>Channel</label>
        <input type='text' id='channel' {...register("channel",{
          required:"Channel is required"
        })} />
        <p>{errors.channel?.message}</p>

        <label htmlFor='twitter'>Twitter</label>
        <input type='text' id='twitter' {...register("social.twitter",{
          required:"Social.twitter is required"
        })} />
        <p>{errors.social?errors.social.twitter?.message:""}</p>

        <label htmlFor='facebook'>Facebook</label>
        <input type='text' id='facebook' {...register("social.facebook")} />

        <label htmlFor='primary-phone'>Primary Phone</label>
        <input type='text' id='primary-phone' {...register("phone.0",{
          required:"Primary phone is required"
        })} />

         <p>{errors.phone?errors.phone[0]?.message:""}</p>

        <label htmlFor='secondary-phone'>Secondary Phone</label>
        <input type='text' id='secondary-phone' {...register("phone.1",{
          required:"Secondary phone is required"
        })} />

          <p>{errors.phone?errors.phone[1]?.message:""}</p>
        <div>
          <label>List of Phone Numbers</label>
          <div>
            {
              fields.map((field,index)=>{
                return (
                  <div className='form-control' key={field.id}>
                    <input type='text' {...register(`phNumbers.${index}.number`)}/>
                    {
                      index > 0 && (
                        <button type='button' onClick={()=>{remove(index)}}>Remove</button>
                      ) 
                    }
                  </div>
                );
              })
            }
          <button type='button' onClick={()=>{append({number:""})}}>Add phone number</button>
          </div>
        </div>
        
        <label htmlFor='age'>Age</label>
        <input type='number' id='age' {...register("age",{
          valueAsNumber:true,
          required:"age is required"
        })} />
        <p>{errors.age?.message}</p>

         <label htmlFor='dob'>DOB</label>
        <input type='date' id='dob' {...register("dob",{
          valueAsDate:true,
          required:"DOB is required"
        })} />
        <p>{errors.dob?.message}</p>
        <button type='button' onClick={()=>{handleSetValue()}}>SetValue</button>
        <button type='button' onClick={()=>{handleGetValue()}}>GetValues</button>
        <button disabled={!isDirty || !isValid}>Submit</button>
        <button onClick={()=>{reset()}}>Reset</button>
        </form>
        <DevTool  control={control}/>
    </div>
  )
}
