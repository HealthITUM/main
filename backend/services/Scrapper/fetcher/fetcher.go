package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

// Ответ от Perenual API (остается прежним)
type PerenualPlant struct {
	ID          int      `json:"id"`
	CommonName  string   `json:"common_name"`
	Watering    string   `json:"watering"`
	Sunlight    []string `json:"sunlight"`
	DefaultImg  struct {
		RegularURL string `json:"regular_url"`
	} `json:"default_image"`
}

type PerenualResponse struct {
	Data []PerenualPlant `json:"data"`
}

// 🎯 Вложенная структура для идеальных параметров датчиков
type IdealValues struct {
	SoilMoisture int `json:"soil_moisture"` // Влажность почвы (%)
	LightLevel   int `json:"light_level"`   // Освещенность (%)
	Temperature  int `json:"temperature"`   // Температура (°C)
}

// 🌿 Финальная структура под твой Record<string, any>
type FinalPlant struct {
	Name        string      `json:"name"`
	Description string      `json:"description"`
	ImageURL    string      `json:"image_url"`
	IdealValues IdealValues `json:"ideal_values"` // <--- Тот самый объект ideal_values
}

// Маппинг влажности почвы (Soil Moisture)
func mapWateringToSoilMoisture(w string) int {
	switch strings.ToLower(w) {
	case "frequent":
		return 70
	case "average":
		return 50
	case "minimal":
		return 25
	default:
		return 50
	}
}

// Маппинг уровня света (Light Level)
func mapSunlightToLightLevel(sun []string) int {
	if len(sun) == 0 {
		return 50
	}
	switch strings.ToLower(sun[0]) {
	case "full sun":
		return 80
	case "part shade", "part sun", "bright indirect":
		return 55
	case "full shade":
		return 30
	default:
		return 50
	}
}

func main() {
	apiKey := os.Getenv("PERENUAL_API_KEY")
	if apiKey == "" {
		apiKey = "sk-xSsI6a108161dbf9417500" // Подставь для теста, если не через env
	}

	var dataset []FinalPlant
	targetCount := 10
	page := 1

	fmt.Println("[FETCHER] Starting to collect 10 premium indoor plants with nested ideal_values...")

	for len(dataset) < targetCount {
		url := fmt.Sprintf("https://perenual.com/api/species-list?key=%s&indoor=1&page=%d", apiKey, page)
		
		resp, err := http.Get(url)
		if err != nil {
			log.Fatalf("HTTP request failed: %v", err)
		}
		
		if resp.StatusCode == 429 {
			log.Println("[WARNING] Rate limit hit! Sleeping for 5 seconds...")
			time.Sleep(5 * time.Second)
			resp.Body.Close()
			continue
		}

		var apiResp PerenualResponse
		if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
			resp.Body.Close()
			log.Fatalf("Failed to decode JSON: %v", err)
		}
		resp.Body.Close()

		if len(apiResp.Data) == 0 {
			break
		}

		for _, item := range apiResp.Data {
			if item.DefaultImg.RegularURL == "" || strings.Contains(item.DefaultImg.RegularURL, "upgrade_access") {
				continue
			}
			if item.CommonName == "" {
				continue
			}

			plant := FinalPlant{
				Name:        strings.Title(item.CommonName),
				Description: fmt.Sprintf("A beautiful houseplant known as %s. Care parameters are optimized for automated IoT ecosystem monitoring.", item.CommonName),
				ImageURL:    item.DefaultImg.RegularURL,
				IdealValues: IdealValues{
					SoilMoisture: mapWateringToSoilMoisture(item.Watering),
					LightLevel:   mapSunlightToLightLevel(item.Sunlight),
					Temperature:  22,   // 22°C дефолт
				},
			}

			dataset = append(dataset, plant)
			fmt.Printf("[+] Captured (%d/%d): %s | Soil: %d%%, Light: %d%%\n", 
				len(dataset), targetCount, plant.Name, plant.IdealValues.SoilMoisture, plant.IdealValues.LightLevel)

			if len(dataset) >= targetCount {
				break
			}
		}

		page++
		time.Sleep(300 * time.Millisecond)
	}

	// Сохраняем в JSON
	file, err := json.MarshalIndent(dataset, "", "  ")
	if err != nil {
		log.Fatalf("Failed to marshal JSON: %v", err)
	}

	err = os.WriteFile("plants_dataset.json", file, 0644)
	if err != nil {
		log.Fatalf("Failed to save file: %v", err)
	}

	fmt.Printf("\n[SUCCESS] Generated 'plants_dataset.json' with %d plants structure matching Record<string, any>!\n", len(dataset))
}