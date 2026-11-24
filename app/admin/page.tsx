"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Upload,
  LogOut,
  Plus,
  Trash2,
  LayoutDashboard,
} from "lucide-react";

type Row = {
  id: string;
  title: string;
  description: string;
  price?: string;
  delivery?: string;
  image_url?: string;
  category?: string;
  active?: boolean;
};

const tabs = ["services", "packages", "portfolio"] as const;
type Tab = (typeof tabs)[number];

export default function Admin() {
  const client = supabase;

  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("services");
  const [rows, setRows] = useState<Row[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!client) return;

    client.auth.getSession().then(({ data, error }) => {
      if (error) {
        setNotice(error.message);
        return;
      }
      setSession(data.session);
    });

    const { data } = client.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && client) {
      load();
    }
  }, [session, tab]);

  async function load(): Promise<boolean> {
    if (!client) return false;

    const { data, error } = await client
      .from(tab)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setRows([]);
      setNotice(`Could not load ${tab}: ${error.message}`);
      return false;
    }

    setRows((data || []) as Row[]);

    const { data: messageData, error: messageError } = await client
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (messageError) {
      setNotice(`Messages loading error: ${messageError.message}`);
    } else {
      setMessages(messageData || []);
    }

    return true;
  }

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!client) return;

    setBusy(true);
    setNotice("");

    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    setNotice(error?.message || "");

    setBusy(false);
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!client) return;

    const form = e.currentTarget;
    setBusy(true);
    setNotice("");

    try {
      const f = new FormData(form);

      let image_url = String(f.get("image_url") || "");
      const file = f.get("file") as File | null;

      if (file && file.size > 0) {
        const path = `${Date.now()}-${file.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "-"
        )}`;

        const { error: uploadError } = await client.storage
          .from("portfolio")
          .upload(path, file, { upsert: false });

        if (uploadError) {
          setNotice(`Image upload failed: ${uploadError.message}`);
          return;
        }

        image_url = client.storage
          .from("portfolio")
          .getPublicUrl(path).data.publicUrl;
      }

      const item: Record<string, any> = {
        title: String(f.get("title") || "").trim(),
        description: String(f.get("description") || "").trim(),
        active: true,
      };

      if (tab === "packages") {
        item.price = String(f.get("price") || "").trim();
        item.delivery = String(f.get("delivery") || "").trim();
      }

      if (tab === "portfolio" || tab === "services") {
        item.category = String(f.get("category") || "").trim();
        item.image_url = image_url;
      }

      const { error: insertError } = await client
        .from(tab)
        .insert(item);

      if (insertError) {
        setNotice(`Save failed: ${insertError.message}`);
        return;
      }

      form.reset();

      const loaded = await load();

      if (loaded) {
        setNotice("Saved successfully. Your item is now in the database.");
      }
    } catch (error: any) {
      setNotice(error?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!client || !confirm("Delete this item?")) return;

    setNotice("");

    const { error } = await client
      .from(tab)
      .delete()
      .eq("id", id);

    if (error) {
      setNotice(`Delete failed: ${error.message}`);
      return;
    }

    await load();
    setNotice("Deleted successfully.");
  }

  if (!client) {
    return (
      <div className="admin-wrap">
        <h1>RAW PIXEL Admin</h1>
        <p>
          Add your Supabase keys to <code>.env.local</code> first.
          See SETUP.md.
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="login-screen">
        <form className="login-card" onSubmit={login}>
          <span className="brand-mark">R</span>
          <p className="eyebrow">RAW PIXEL / PRIVATE AREA</p>
          <h1>Admin Login</h1>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button className="button button-yellow" disabled={busy}>
            {busy ? "Signing in..." : "Sign in ↗"}
          </button>

          {notice && <p>{notice}</p>}

          <a href="/">← Back to website</a>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <a className="brand" href="/">
          <span className="brand-mark">R</span>
          <span>RAW PIXEL</span>
        </a>

        <p className="eyebrow">CONTENT MANAGER</p>

        {tabs.map((t) => (
          <button
            className={tab === t ? "selected" : ""}
            onClick={() => {
              setTab(t);
              setNotice("");
            }}
            key={t}
          >
            {t === "services"
              ? "Services"
              : t === "packages"
              ? "Packages"
              : "Portfolio"}
          </button>
        ))}

        <button onClick={() => setTab("services")}>
          <LayoutDashboard size={16} /> Overview
        </button>

        <button className="logout" onClick={() => client.auth.signOut()}>
          <LogOut size={16} /> Sign out
        </button>
      </aside>

      <section className="admin-main">
        <div className="admin-top">
          <div>
            <p className="eyebrow">MANAGE YOUR WEBSITE</p>
            <h1>{tab[0].toUpperCase() + tab.slice(1)}</h1>
          </div>

          <a href="/" target="_blank" rel="noreferrer">
            View website ↗
          </a>
        </div>

        <form className="admin-form" onSubmit={save}>
          <h2>
            <Plus size={18} /> Add {tab.slice(0, -1)}
          </h2>

          <label>
            Title
            <input name="title" required placeholder="Enter title" />
          </label>

          <label>
            Description
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Short description"
            />
          </label>

          {tab !== "portfolio" && (
            <label>
              {tab === "packages" ? "Price" : "Category"}
              <input
                name={tab === "packages" ? "price" : "category"}
                placeholder={
                  tab === "packages" ? "Starting at $25" : "Brand Identity"
                }
              />
            </label>
          )}

          {tab === "packages" && (
            <label>
              Delivery time
              <input name="delivery" placeholder="3 days" />
            </label>
          )}

          {tab !== "packages" && (
            <>
              <label>
                Category
                <input
                  name="category"
                  placeholder={
                    tab === "services" ? "Brand Identity" : "Logo Design"
                  }
                />
              </label>

              <label>
                Upload image (optional)
                <input
                  name="file"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                />
              </label>
            </>
          )}

          <button className="button button-yellow" disabled={busy}>
            {busy ? "Saving..." : "Save item"} <Upload size={15} />
          </button>
        </form>

        {notice && <p className="admin-notice">{notice}</p>}

        <div className="admin-list">
          <h2>Current {tab}</h2>

          {rows.length === 0 && <p>No {tab} found.</p>}

          {rows.map((r) => (
            <article key={r.id}>
              {r.image_url && <img src={r.image_url} alt="" />}

              <div>
                <b>{r.title}</b>
                <p>{r.description}</p>

                {r.price && (
                  <small>
                    {r.price} · {r.delivery}
                  </small>
                )}
              </div>

              <button
                onClick={() => remove(r.id)}
                aria-label="Delete"
              >
                <Trash2 size={17} />
              </button>
            </article>
          ))}
        </div>

        <div className="admin-list">
          <h2>Client messages ({messages.length})</h2>

          {messages.map((m) => (
            <article key={m.id}>
              <div>
                <b>
                  {m.name} · {m.email}
                </b>
                <p>{m.service}</p>
                <small>{m.message}</small>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
