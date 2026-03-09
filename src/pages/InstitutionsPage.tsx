import React, { useState, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import InstitutionCard from "@/components/InstitutionCard";
import { mockInstitutions } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const InstitutionsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const lang = language === "zh-HK" ? "zh" : "en";
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"nearest" | "highestRated" | "lowestPrice">("nearest");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { key: "all", label: t.institutions.all },
    { key: "general", label: t.institutions.general },
    { key: "orthodontics", label: t.institutions.orthodontics },
    { key: "implants", label: t.institutions.implants },
    { key: "cosmetic", label: t.institutions.cosmetic },
    { key: "pediatric", label: t.institutions.pediatric },
  ];

  const sortOptions = [
    { key: "nearest" as const, label: t.institutions.nearest },
    { key: "highestRated" as const, label: t.institutions.highestRated },
    { key: "lowestPrice" as const, label: t.institutions.lowestPrice },
  ];

  const filtered = useMemo(() => {
    let results = mockInstitutions.filter((inst) => {
      const matchesSearch =
        !search ||
        inst.name[lang].toLowerCase().includes(search.toLowerCase()) ||
        inst.popularServices.some((s) => s[lang].toLowerCase().includes(search.toLowerCase()));
      const matchesCategory =
        selectedCategory === "all" || inst.categories.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "nearest") results.sort((a, b) => a.distance - b.distance);
    else if (sortBy === "highestRated") results.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "lowestPrice") results.sort((a, b) => (a.services[0]?.price ?? 0) - (b.services[0]?.price ?? 0));

    return results;
  }, [search, selectedCategory, sortBy, lang]);

  return (
    <div className="animate-fade-in p-4 pt-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-xl font-bold text-foreground">{t.institutions.title}</h1>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t.institutions.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Categories */}
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedCategory === cat.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {sortOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`whitespace-nowrap rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
              sortBy === opt.key
                ? "border-primary bg-secondary text-primary"
                : "border-border text-muted-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="mb-3 text-xs text-muted-foreground">
        {filtered.length} {t.institutions.results}
      </p>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((inst) => (
            <InstitutionCard key={inst.id} institution={inst} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-16 text-center">
          <Search className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-base font-medium text-foreground">{t.institutions.noResults}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.institutions.noResultsDesc}</p>
        </div>
      )}
    </div>
  );
};

export default InstitutionsPage;
