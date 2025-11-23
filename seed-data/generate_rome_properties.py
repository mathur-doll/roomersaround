#!/usr/bin/env python3
"""
Generate 500 fake properties in Rome and nearby cities (within 1 hour train distance)
"""
import json
import random

# Rome neighborhoods and nearby cities (within 1 hour by train)
LOCATIONS = [
    # Rome neighborhoods (75% of properties)
    {"city": "Rome", "neighborhood": "Trastevere", "lat": 41.8897, "lon": 12.4681, "weight": 10},
    {"city": "Rome", "neighborhood": "Monti", "lat": 41.8942, "lon": 12.4899, "weight": 10},
    {"city": "Rome", "neighborhood": "Centro Storico", "lat": 41.8986, "lon": 12.4719, "weight": 10},
    {"city": "Rome", "neighborhood": "Testaccio", "lat": 41.8777, "lon": 12.4778, "weight": 8},
    {"city": "Rome", "neighborhood": "Prati", "lat": 41.9065, "lon": 12.4582, "weight": 8},
    {"city": "Rome", "neighborhood": "Pigneto", "lat": 41.8865, "lon": 12.5311, "weight": 8},
    {"city": "Rome", "neighborhood": "San Lorenzo", "lat": 41.8991, "lon": 12.5187, "weight": 7},
    {"city": "Rome", "neighborhood": "EUR", "lat": 41.8338, "lon": 12.4677, "weight": 6},
    {"city": "Rome", "neighborhood": "San Giovanni", "lat": 41.8859, "lon": 12.5129, "weight": 7},
    {"city": "Rome", "neighborhood": "Esquilino", "lat": 41.8955, "lon": 12.5009, "weight": 6},
    {"city": "Rome", "neighborhood": "Ostiense", "lat": 41.8697, "lon": 12.4797, "weight": 6},
    {"city": "Rome", "neighborhood": "Garbatella", "lat": 41.8697, "lon": 12.4869, "weight": 5},
    {"city": "Rome", "neighborhood": "Flaminio", "lat": 41.9194, "lon": 12.4719, "weight": 5},
    {"city": "Rome", "neighborhood": "Salario", "lat": 41.9199, "lon": 12.5059, "weight": 5},
    {"city": "Rome", "neighborhood": "Trieste", "lat": 41.9299, "lon": 12.5169, "weight": 4},
    {"city": "Rome", "neighborhood": "Tiburtino", "lat": 41.9099, "lon": 12.5319, "weight": 4},
    {"city": "Rome", "neighborhood": "Nomentano", "lat": 41.9199, "lon": 12.5219, "weight": 4},
    {"city": "Rome", "neighborhood": "Parioli", "lat": 41.9269, "lon": 12.4849, "weight": 4},
    {"city": "Rome", "neighborhood": "Monteverde", "lat": 41.8799, "lon": 12.4599, "weight": 4},
    {"city": "Rome", "neighborhood": "Appio Latino", "lat": 41.8699, "lon": 12.5199, "weight": 3},

    # Nearby cities within 1 hour by train (25% of properties)
    {"city": "Tivoli", "neighborhood": "Centro", "lat": 41.9626, "lon": 12.7981, "weight": 3},
    {"city": "Frascati", "neighborhood": "Centro", "lat": 41.8089, "lon": 12.6816, "weight": 4},
    {"city": "Ostia", "neighborhood": "Lido", "lat": 41.7265, "lon": 12.2897, "weight": 5},
    {"city": "Albano Laziale", "neighborhood": "Centro", "lat": 41.7289, "lon": 12.6592, "weight": 2},
    {"city": "Anzio", "neighborhood": "Porto", "lat": 41.4494, "lon": 12.6254, "weight": 2},
    {"city": "Civitavecchia", "neighborhood": "Centro", "lat": 42.0938, "lon": 11.7969, "weight": 2},
    {"city": "Castelli Romani", "neighborhood": "Grottaferrata", "lat": 41.7851, "lon": 12.6722, "weight": 2},
    {"city": "Nettuno", "neighborhood": "Centro", "lat": 41.4559, "lon": 12.6631, "weight": 1},
]

PROPERTY_TYPES = ["Studio", "Apartment", "Loft", "Penthouse", "Shared Room", "Villa"]

AMENITIES_OPTIONS = [
    "WiFi", "Kitchen", "Heating", "Air Conditioning", "Washing Machine",
    "Dishwasher", "Balcony", "Terrace", "Garden", "Parking", "Elevator",
    "Gym", "Pool", "Security", "Pet Friendly", "Wheelchair Accessible",
    "Near Metro", "Near Train Station", "Beach Access", "Historical Building"
]

STREET_NAMES = [
    "Via Nazionale", "Via del Corso", "Via dei Fori Imperiali", "Via Veneto",
    "Via Giulia", "Via Margutta", "Via dei Coronari", "Via del Governo Vecchio",
    "Via Appia Nuova", "Via Tuscolana", "Via Casilina", "Via Tiburtina",
    "Via Nomentana", "Via Salaria", "Via Flaminia", "Viale Trastevere",
    "Lungotevere", "Via della Lungara", "Via Labicana", "Via Galvani",
    "Via del Pigneto", "Via Germanico", "Viale Europa", "Piazza di Spagna",
    "Via della Conciliazione", "Via Cavour", "Via Merulana", "Via Po",
    "Via Sistina", "Via del Babuino", "Corso Vittorio Emanuele"
]

DESCRIPTIONS_TEMPLATES = [
    "Charming {property_type} in the heart of {neighborhood}. {feature}",
    "Modern {property_type} with {feature}. Perfect location in {neighborhood}.",
    "Bright and spacious {property_type} in {neighborhood}. {feature}",
    "Cozy {property_type} with excellent transport connections. {feature}",
    "Beautiful {property_type} in historic {neighborhood}. {feature}",
    "Newly renovated {property_type} in vibrant {neighborhood}. {feature}",
    "Comfortable {property_type} with all amenities. {feature}",
    "Stylish {property_type} in trendy {neighborhood}. {feature}",
    "Peaceful {property_type} with {feature} in {neighborhood}.",
    "Elegant {property_type} featuring {feature}. Great {neighborhood} location."
]

FEATURES = [
    "Walking distance to restaurants and shops",
    "Close to public transportation",
    "Recently refurbished with modern finishes",
    "Quiet street but central location",
    "Great for professionals and students",
    "Excellent neighborhood atmosphere",
    "Near parks and green spaces",
    "Vibrant local community",
    "Easy access to city center",
    "Perfect for digital nomads"
]

def generate_properties(count=500):
    """Generate realistic property data for Rome area"""
    properties = []

    # Create weighted location list
    locations_weighted = []
    for loc in LOCATIONS:
        locations_weighted.extend([loc] * loc["weight"])

    for i in range(1, count + 1):
        location = random.choice(locations_weighted)
        property_type = random.choice(PROPERTY_TYPES)

        # Adjust property characteristics based on type
        if property_type == "Studio":
            bedrooms = 1
            bathrooms = 1
            area_sqm = random.randint(30, 55)
            price_base = random.randint(700, 1000)
        elif property_type == "Shared Room":
            bedrooms = 1
            bathrooms = 1
            area_sqm = random.randint(15, 35)
            price_base = random.randint(400, 650)
        elif property_type == "Apartment":
            bedrooms = random.randint(1, 3)
            bathrooms = random.randint(1, 2)
            area_sqm = random.randint(50, 100)
            price_base = random.randint(800, 1500)
        elif property_type == "Loft":
            bedrooms = random.randint(1, 2)
            bathrooms = random.randint(1, 2)
            area_sqm = random.randint(60, 110)
            price_base = random.randint(1000, 1700)
        elif property_type == "Penthouse":
            bedrooms = random.randint(2, 4)
            bathrooms = random.randint(2, 3)
            area_sqm = random.randint(90, 150)
            price_base = random.randint(1500, 2500)
        else:  # Villa
            bedrooms = random.randint(2, 4)
            bathrooms = random.randint(2, 3)
            area_sqm = random.randint(100, 200)
            price_base = random.randint(1200, 2200)

        # Adjust price for location (Centro Storico is more expensive)
        if location["neighborhood"] in ["Centro Storico", "Parioli", "Prati"]:
            price_modifier = 1.3
        elif location["city"] != "Rome":  # Nearby cities are cheaper
            price_modifier = 0.8
        else:
            price_modifier = 1.0

        price_per_month = int(price_base * price_modifier)

        # Generate random amenities (4-8 amenities per property)
        num_amenities = random.randint(4, 8)
        amenities = random.sample(AMENITIES_OPTIONS, num_amenities)

        # Ensure basic amenities
        if "WiFi" not in amenities:
            amenities.append("WiFi")
        if "Kitchen" not in amenities and property_type != "Shared Room":
            amenities.append("Kitchen")

        # Status - 60% available, 40% occupied
        status = "available" if random.random() < 0.6 else "occupied"

        # Generate address
        street = random.choice(STREET_NAMES)
        number = random.randint(1, 300)
        address = f"{street} {number}"

        # Add small random offset to coordinates for variety
        lat_offset = random.uniform(-0.01, 0.01)
        lon_offset = random.uniform(-0.01, 0.01)

        # Generate description
        template = random.choice(DESCRIPTIONS_TEMPLATES)
        feature = random.choice(FEATURES)
        description = template.format(
            property_type=property_type.lower(),
            neighborhood=location["neighborhood"],
            feature=feature
        )

        # Create title
        title_templates = [
            f"{random.choice(['Charming', 'Modern', 'Bright', 'Cozy', 'Elegant'])} {property_type} in {location['neighborhood']}",
            f"{property_type} near {random.choice(['Metro', 'Center', 'Parks', 'Restaurants'])} - {location['neighborhood']}",
            f"Beautiful {property_type} - {location['neighborhood']}, {location['city']}",
        ]
        title = random.choice(title_templates)

        property_data = {
            "id": i,
            "title": title,
            "description": description,
            "address": address,
            "city": location["city"],
            "neighborhood": location["neighborhood"],
            "country": "Italy",
            "latitude": round(location["lat"] + lat_offset, 6),
            "longitude": round(location["lon"] + lon_offset, 6),
            "price_per_month": price_per_month,
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
            "area_sqm": area_sqm,
            "property_type": property_type,
            "amenities": sorted(amenities),
            "status": status,
            "images": [f"/images/properties/{location['city'].lower()}-{location['neighborhood'].lower()}-{i}.jpg"],
            "owner_id": random.randint(1, 50)
        }

        properties.append(property_data)

    return {"properties": properties}

if __name__ == "__main__":
    print("Generating 500 properties in Rome and nearby areas...")
    data = generate_properties(500)

    with open("fake_data_properties.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✓ Generated {len(data['properties'])} properties")

    # Print statistics
    rome_count = sum(1 for p in data['properties'] if p['city'] == 'Rome')
    available_count = sum(1 for p in data['properties'] if p['status'] == 'available')

    print(f"  - Rome: {rome_count} properties")
    print(f"  - Nearby cities: {len(data['properties']) - rome_count} properties")
    print(f"  - Available: {available_count}")
    print(f"  - Occupied: {len(data['properties']) - available_count}")
    print(f"  - Price range: €{min(p['price_per_month'] for p in data['properties'])} - €{max(p['price_per_month'] for p in data['properties'])}/month")
