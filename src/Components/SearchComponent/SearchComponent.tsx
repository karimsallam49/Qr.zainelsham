import { useState, useEffect, useRef } from "react";
import { Form, Spinner } from "react-bootstrap";
import { Search } from "lucide-react";
import { useFetch } from "../../Hooks/useFetch";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";
import { SearchSuggestionAPI } from "../../EndPoints/EndPoints";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SearchComponent = () => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const { currentLanguage } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 2000);
    return () => clearTimeout(handler);
  }, [searchText]);

  const API = `${SearchSuggestionAPI}name=${debouncedSearch}`;
  const { data, isLoading, error } = useFetch<string[]>(currentLanguage, API, {
    enabled: !!debouncedSearch,
  });

  const handlesetsearchsugg = (suggestion: string) => {
    setSearchText(suggestion);
    const encodedQuery = encodeURIComponent(suggestion.trim());
    navigate(`/search?query=${encodedQuery}`);
  };

  return (
    <div className="container h-100 w-100 py-3 position-relative" ref={containerRef}>
      <div className="d-flex w-100 h-100 justify-content-center align-items-center  position-relative">
        <div
          className="position-relative w-100"
          style={{ maxWidth: "700px" }}
        >
          <Search
            size={20}
            color="#aaa"
            className="position-absolute"
            style={{
              top: "50%",
              left: "15px",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />
          <Form.Control
            type="text"
            placeholder={t("Search")}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border-0 bg-white text-dark shadow-sm"
            style={{
              borderRadius: "30px",
              paddingLeft: "40px", 
              height: "45px",
            }}
          />
        </div>

        
            {debouncedSearch && !isLoading && data && data.length > 0 && (
          <div
            className="position-absolute bg-white shadow-sm w-100 mt-1 p-2 rounded"
            style={{
              top: "100%",
              left: 0,
              maxHeight: "300px",
              overflowY: "auto",
              zIndex: 1000,
              maxWidth: "80%",
            }}
          >
            {isLoading && (
              <div className="text-center py-2">
                <Spinner animation="border" size="sm" /> جاري البحث...
              </div>
            )}

            {error && <p className="text-danger text-center">حدث خطأ أثناء البحث</p>}

            {!isLoading && data?.length === 0 && (
              <p className="text-muted text-center mb-0">لا توجد نتائج</p>
            )}

            {!isLoading &&
              data?.map((suggestion, index) => (
                <div
                  key={index}
                  className="py-2 px-3 border-bottom"
                  style={{
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onClick={() => handlesetsearchsugg(suggestion)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f8f9fa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {suggestion}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
