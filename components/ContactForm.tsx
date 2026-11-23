 "use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
export default function ContactForm(){
 const [status,setStatus]=useState("");
 const [busy,setBusy]=useState(false);
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault(); const formElement=e.currentTarget; setBusy(true); setStatus("");
  const form=new FormData(formElement);
  const payload={name:String(form.get("name")),email:String(form.get("email")),service:String(form.get("service")),message:String(form.get("message"))};
  if(!supabase){setStatus("Contact form needs Supabase setup. Please use the email link for now.");setBusy(false);return;}
  const {error}=await supabase.from("messages").insert(payload);
  setStatus(error?"Message could not be sent. Please email directly.":"Thanks! Your message has been sent.");
  if(!error)formElement.reset();
  setBusy(false);
 }
 return <form className="contact-form" onSubmit={submit}><label>Your name<input name="name" placeholder="Name" required/></label><label>Email address<input name="email" type="email" placeholder="you@example.com" required/></label><label>What do you need?<select name="service" defaultValue=""><option value="" disabled>Select a service</option><option>Logo Design</option><option>Social Media Cover Design</option><option>Letterhead Design</option><option>Visiting Card Design</option><option>Other</option></select></label><label>Tell me about your project<textarea name="message" placeholder="A few details about your idea..." rows={4} required/></label><button className="button button-yellow" disabled={busy}>{busy?"Sending...":"Send Message"} ↗</button>{status&&<p className="form-status">{status}</p>}</form>
}
