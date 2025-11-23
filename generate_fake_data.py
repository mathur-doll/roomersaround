#!/usr/bin/env python3
"""
RoomersAround Rome - Fake Data Generator
Generates realistic fake data for users, properties, and events
"""

import json
import random
from datetime import datetime, timedelta

# Italian cities and neighborhoods
ITALIAN_LOCATIONS = [
    # Rome neighborhoods
    "Trastevere, Rome", "Monti, Rome", "Testaccio, Rome", "Prati, Rome", "San Lorenzo, Rome",
    "Garbatella, Rome", "EUR, Rome", "Flaminio, Rome", "Centro Storico, Rome", "Aventino, Rome",
    "Pigneto, Rome", "Ostiense, Rome", "Tiburtino, Rome", "Trieste, Rome", "Nomentano, Rome",
    "Esquilino, Rome", "Celio, Rome", "San Giovanni, Rome", "Appio Latino, Rome", "Tuscolano, Rome",

    # Milan
    "Brera, Milan", "Navigli, Milan", "Porta Venezia, Milan", "Porta Romana, Milan", "Isola, Milan",
    "Lambrate, Milan", "Centrale, Milan", "Città Studi, Milan", "Moscova, Milan", "Garibaldi, Milan",

    # Florence
    "Santo Spirito, Florence", "Santa Croce, Florence", "San Lorenzo, Florence", "Duomo, Florence",
    "Oltrarno, Florence", "San Frediano, Florence", "Campo di Marte, Florence",

    # Bologna
    "Quartiere Santo Stefano, Bologna", "Bolognina, Bologna", "Porto, Bologna", "Mazzini, Bologna",
    "Irnerio, Bologna", "Saragozza, Bologna",

    # Turin
    "San Salvario, Turin", "Quadrilatero Romano, Turin", "Crocetta, Turin", "Vanchiglia, Turin",
    "San Donato, Turin",

    # Venice
    "Cannaregio, Venice", "Dorsoduro, Venice", "San Marco, Venice", "Castello, Venice",

    # Naples
    "Vomero, Naples", "Chiaia, Naples", "Centro Storico, Naples", "Posillipo, Naples",

    # Other cities
    "Centro, Verona", "San Benedetto, Padua", "Centro, Pisa", "Porta Nuova, Genoa",
    "Trastevere, Perugia", "Centro, Siena", "Porto, Palermo", "Barri Gotic, Catania"
]

# Diverse nationalities (mostly expats and students)
NATIONALITIES = {
    "European": ["French", "Spanish", "German", "Portuguese", "Greek", "Polish", "Romanian",
                 "Dutch", "Belgian", "Austrian", "Swedish", "Danish", "Norwegian", "Finnish",
                 "Czech", "Hungarian", "Croatian", "Bulgarian", "Irish", "Scottish"],
    "Asian": ["Japanese", "Korean", "Chinese", "Taiwanese", "Indian", "Vietnamese", "Thai",
              "Malaysian", "Singaporean", "Indonesian", "Filipino", "Pakistani", "Bangladeshi"],
    "American": ["American", "Canadian", "Mexican", "Brazilian", "Argentine", "Colombian",
                 "Chilean", "Peruvian"],
    "Other": ["Australian", "New Zealander", "South African", "Egyptian", "Turkish", "Israeli"]
}

# Names by region
NAMES = {
    "French": ["Sophie Laurent", "Marie Dubois", "Emma Bernard", "Léa Martin", "Camille Petit",
               "Lucas Moreau", "Hugo Laurent", "Antoine Thomas", "Louis Robert", "Alexandre Blanc"],
    "Spanish": ["Diego Hernández", "Ana Rodríguez", "Carlos García", "María López", "Laura Martínez",
                "Pablo Sánchez", "Carmen Fernández", "Javier González", "Elena Pérez", "Miguel Torres"],
    "German": ["Lars Müller", "Anna Schmidt", "Felix Weber", "Sarah Fischer", "Maximilian Meyer",
               "Laura Wagner", "Jonas Becker", "Lisa Hoffmann", "Paul Schulz", "Emma Schäfer"],
    "Japanese": ["Yuki Tanaka", "Hiroshi Sato", "Sakura Watanabe", "Takeshi Yamamoto", "Aiko Nakamura",
                 "Kenji Kobayashi", "Haruka Ito", "Daiki Suzuki", "Mei Tanaka", "Ryu Yoshida"],
    "Korean": ["Min-jun Kim", "Seo-yeon Park", "Ji-woo Lee", "Hyun-woo Choi", "Soo-jin Jung",
               "Jae-sung Kang", "Eun-ji Cho", "Tae-yang Yoon", "Hye-jin Lim", "Dong-hyun Han"],
    "Chinese": ["Wei Chen", "Li Wang", "Ming Zhang", "Yan Liu", "Ling Yang", "Jun Wu", "Xia Zhao",
                "Feng Zhou", "Mei Lin", "Jian Xu"],
    "American": ["James Mitchell", "Emily Johnson", "Michael Brown", "Sarah Davis", "David Wilson",
                 "Jessica Taylor", "Christopher Anderson", "Amanda Thomas", "Matthew Jackson", "Ashley White"],
    "Brazilian": ["Lucas Silva", "Ana Santos", "Pedro Oliveira", "Julia Costa", "Gabriel Souza",
                  "Mariana Lima", "Rafael Pereira", "Camila Alves", "Felipe Rodrigues", "Beatriz Ferreira"],
    "Indian": ["Raj Patel", "Priya Sharma", "Arjun Kumar", "Ananya Singh", "Rohan Gupta",
               "Kavya Reddy", "Aditya Mehta", "Ishita Verma", "Vikram Shah", "Sneha Iyer"],
    "Polish": ["Jakub Kowalski", "Anna Nowak", "Piotr Wiśniewski", "Maria Wójcik", "Michał Kamiński"],
    "Portuguese": ["João Silva", "Maria Santos", "Pedro Costa", "Ana Rodrigues", "Miguel Ferreira"],
    "Greek": ["Nikos Papadopoulos", "Sofia Georgiou", "Andreas Dimitriou", "Elena Konstantinou"],
    "Dutch": ["Luuk de Vries", "Emma van den Berg", "Lars Bakker", "Sophie Jansen"],
    "Swedish": ["Erik Andersson", "Emma Johansson", "Oscar Karlsson", "Sofia Nilsson"],
    "Australian": ["Jack Wilson", "Olivia Anderson", "William Thompson", "Charlotte Roberts"],
    "Turkish": ["Mehmet Yılmaz", "Elif Demir", "Ahmet Şahin", "Zeynep Çelik"],
    "Default": ["Alex Morgan", "Jordan Taylor", "Casey Johnson", "Riley Anderson", "Quinn Martinez"]
}

# Professions (student and expat focused)
PROFESSIONS = [
    # Students
    "Architecture Student", "Engineering Student", "Business Student", "Art Student",
    "Medical Student", "Law Student", "International Relations Student", "Economics Student",
    "Design Student", "Film Student", "Music Student", "Literature Student",

    # Young professionals
    "Software Engineer", "Data Analyst", "Digital Marketer", "UX Designer", "Product Manager",
    "Financial Analyst", "Consultant", "Content Creator", "Social Media Manager", "Journalist",

    # Creative professionals
    "Fashion Designer", "Photographer", "Graphic Designer", "Illustrator", "Filmmaker",
    "Musician", "Chef", "Food Blogger", "Travel Writer", "Artist",

    # Academic/Research
    "Researcher", "PhD Candidate", "Postdoc Fellow", "Professor", "Archaeologist",
    "Art Curator", "Museum Guide", "Language Teacher", "ESL Teacher",

    # Other expat jobs
    "Tour Guide", "Translator", "Au Pair", "Freelance Writer", "Remote Worker",
    "Startup Founder", "Tech Entrepreneur", "NGO Worker", "Diplomat"
]

# Property types
PROPERTY_TYPES = ["Apartment", "Studio", "Loft", "Shared Room", "Private Room", "Penthouse", "Townhouse"]

# Amenities
AMENITIES = [
    "WiFi", "Air Conditioning", "Heating", "Washing Machine", "Dishwasher", "TV",
    "Balcony", "Terrace", "Garden", "Parking", "Elevator", "Concierge",
    "Gym", "Pool", "Bike Storage", "Pet Friendly", "Furnished", "Kitchen",
    "Work Desk", "City Views", "Quiet Area", "Near Metro", "Near Bus",
    "Shopping Nearby", "Restaurants Nearby", "Historic Building", "Modern Building",
    "Renovated", "High Ceilings", "Natural Light", "Hardwood Floors"
]

# Unsplash image IDs for properties (curated Italian/European apartment photos)
PROPERTY_IMAGES = [
    "photo-1600566753190-17f0baa2a6c3", "photo-1600573472592-401e03fb9ace",
    "photo-1512917774080-9991f1c4c750", "photo-1600585154340-be6161a56a0c",
    "photo-1600607687920-4e2a09cf159d", "photo-1600573472550-8090b5e0745e",
    "photo-1560448204-e02f11c3d0e2", "photo-1502672260066-6b5ec0e0f37c",
    "photo-1600607687644-c7171b42498f", "photo-1556020685-ae41abfc9365",
    "photo-1560185007-c5ca9d2c014d", "photo-1522708323590-d24dbb6b0267",
    "photo-1502672023488-70e25813eb80", "photo-1600585154526-990dced4db0d",
    "photo-1560184897-ae75f418493e", "photo-1502672260266-1c1ef2d93688",
    "photo-1556020685-8ee4e8c6f6f7", "photo-1560185009-5bf9f2849488",
    "photo-1600607687839-e744c1b7e9e2", "photo-1560448204-61dc36dc98c8"
]

# User avatars (diverse faces)
USER_AVATARS = [
    "photo-1494790108377-be9c29b29330", "photo-1507003211169-0a1dd7228f2d",
    "photo-1438761681033-6461ffad8d80", "photo-1500648767791-00dcc994a43e",
    "photo-1487412720507-e7ab37603c6f", "photo-1506794778202-cad84cf45f1d",
    "photo-1534528741775-53994a69daeb", "photo-1539571696357-5a69c17a67c6",
    "photo-1524504388940-b1c1722653e1", "photo-1517841905240-472988babdf9",
    "photo-1488426862026-3ee34a7d66df", "photo-1502767089025-6572583495f9",
    "photo-1531746020798-e6953c6e8e04", "photo-1544005313-94ddf0286df2",
    "photo-1527980965255-d3b416303d12", "photo-1573497019940-1c28c88b4f3e"
]

def generate_users(count=250):
    """Generate diverse international users"""
    users = []
    user_id = 1

    for i in range(count):
        # Select nationality
        region = random.choice(list(NATIONALITIES.keys()))
        nationality = random.choice(NATIONALITIES[region])

        # Get name based on nationality
        name_key = nationality if nationality in NAMES else "Default"
        if name_key not in NAMES:
            name_key = random.choice(list(NAMES.keys()))

        name = random.choice(NAMES[name_key]) if i >= 10 else NAMES[name_key][min(i, len(NAMES[name_key])-1)]

        # Generate user data
        age = random.randint(20, 35)  # Typical student/young professional age
        profession = random.choice(PROFESSIONS)
        avatar = f"https://images.unsplash.com/{random.choice(USER_AVATARS)}?w=150"

        # Create bio
        if "Student" in profession:
            bio = f"Erasmus {profession.replace(' Student', '')} student exploring Italy"
        elif profession in ["Software Engineer", "Data Analyst", "Digital Marketer"]:
            bio = f"Remote {profession.lower()} living the Italian dream"
        elif profession in ["Chef", "Food Blogger", "Tour Guide"]:
            bio = f"{profession} sharing Italy's treasures"
        else:
            bio = f"{profession} embracing la dolce vita"

        # Interests based on profession
        interest_categories = {
            "Student": ["Study Groups", "Language Exchange", "Travel", "Nightlife"],
            "Tech": ["Technology", "Startups", "Coworking", "Innovation"],
            "Creative": ["Art", "Design", "Photography", "Culture"],
            "Food": ["Cooking", "Wine", "Restaurants", "Food Tours"],
            "Academic": ["History", "Museums", "Research", "Books"]
        }

        if "Student" in profession:
            interests = random.sample(interest_categories["Student"] + ["Coffee", "Cycling", "Concerts"], 4)
        elif profession in ["Software Engineer", "Data Analyst", "Product Manager"]:
            interests = random.sample(interest_categories["Tech"] + ["Gaming", "Hiking"], 4)
        elif "Designer" in profession or "Artist" in profession:
            interests = random.sample(interest_categories["Creative"] + ["Fashion", "Music"], 4)
        elif profession in ["Chef", "Food Blogger"]:
            interests = random.sample(interest_categories["Food"] + ["Markets", "Gelato"], 4)
        else:
            interests = random.sample(["Travel", "Music", "Art", "Sports", "Food", "Cinema"], 4)

        # Random rating and verification
        rating = round(random.uniform(4.3, 5.0), 1)
        verified = random.choice([True, True, True, False])  # 75% verified

        # Join date (last 18 months)
        days_ago = random.randint(0, 540)
        joined_date = (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d")

        user = {
            "id": user_id,
            "name": name,
            "avatar": avatar,
            "profession": profession,
            "age": age,
            "nationality": nationality,
            "bio": bio,
            "interests": interests,
            "rating": rating,
            "verified": verified,
            "joinedDate": joined_date
        }

        users.append(user)
        user_id += 1

    return users

def generate_properties(count=500, user_count=250):
    """Generate diverse properties across Italy"""
    properties = []
    property_id = 1

    # Property name templates
    area_descriptors = ["Charming", "Cozy", "Modern", "Historic", "Elegant", "Spacious",
                       "Romantic", "Artistic", "Luxurious", "Contemporary", "Traditional",
                       "Bright", "Stunning", "Beautiful", "Amazing", "Perfect"]

    property_words = ["Apartment", "Studio", "Loft", "Home", "Retreat", "Residence",
                     "Haven", "Suite", "Flat", "Place", "Space", "Nest"]

    location_features = ["Garden", "View", "Terrace", "Balcony", "Courtyard", "Rooftop",
                        "Corner", "Walk", "Hub", "Spot", "House", "Villa"]

    for i in range(count):
        # Location
        location = random.choice(ITALIAN_LOCATIONS)
        neighborhood = location.split(",")[0]
        city = location.split(",")[1].strip() if "," in location else "Rome"

        # Property name
        name_template = random.choice([
            f"{neighborhood} {random.choice(area_descriptors)} {random.choice(property_words)}",
            f"{random.choice(area_descriptors)} {neighborhood} {random.choice(property_words)}",
            f"{neighborhood} {random.choice(location_features)}",
        ])

        # Property type and size
        prop_type = random.choice(PROPERTY_TYPES)

        if prop_type == "Studio":
            bedrooms = 0
            bathrooms = 1
            size = random.randint(25, 45)
            price = random.randint(500, 900)
        elif prop_type == "Shared Room":
            bedrooms = 1
            bathrooms = 1
            size = random.randint(15, 25)
            price = random.randint(350, 600)
        elif prop_type == "Private Room":
            bedrooms = 1
            bathrooms = 1
            size = random.randint(20, 35)
            price = random.randint(450, 750)
        elif prop_type == "Penthouse":
            bedrooms = random.randint(2, 4)
            bathrooms = random.randint(2, 3)
            size = random.randint(100, 200)
            price = random.randint(1500, 3500)
        else:  # Apartment, Loft, Townhouse
            bedrooms = random.randint(1, 3)
            bathrooms = random.randint(1, 2)
            size = random.randint(45, 120)
            price = random.randint(650, 1800)

        # Adjust prices for cities
        if city == "Milan":
            price = int(price * 1.3)
        elif city == "Florence" or city == "Venice":
            price = int(price * 1.2)
        elif city in ["Bologna", "Turin"]:
            price = int(price * 1.1)
        elif city in ["Naples", "Palermo", "Catania"]:
            price = int(price * 0.8)

        # Round price
        price = round(price / 10) * 10

        # Duration
        duration = random.choice(["3-12 months", "6-12 months", "3-6 months", "12+ months"])

        # Image
        image = f"https://images.unsplash.com/{random.choice(PROPERTY_IMAGES)}?w=600"

        # Amenities (5-10 random amenities)
        num_amenities = random.randint(5, 10)
        amenities = random.sample(AMENITIES, num_amenities)

        # Description templates
        descriptions = [
            f"Beautiful {prop_type.lower()} in the heart of {neighborhood}. Perfect for students and young professionals.",
            f"Charming {prop_type.lower()} located in {neighborhood}, one of {city}'s most vibrant neighborhoods.",
            f"Modern {prop_type.lower()} with all amenities in {neighborhood}. Great transport connections.",
            f"Cozy {prop_type.lower()} in {neighborhood}, close to universities, shops, and restaurants.",
            f"Spacious {prop_type.lower()} in {neighborhood} with authentic Italian charm and modern comforts.",
            f"Lovely {prop_type.lower()} in the historic {neighborhood} area. Walking distance to main attractions.",
            f"Contemporary {prop_type.lower()} in trendy {neighborhood}. Perfect for expats and international students.",
            f"Elegant {prop_type.lower()} in {neighborhood}. Recently renovated with high-quality finishes."
        ]

        description = random.choice(descriptions)

        # Owner (random user)
        owner_id = random.randint(1, min(user_count, property_id))

        # Verification (80% verified)
        verified = random.choice([True, True, True, True, False])

        # Dates
        days_ago = random.randint(0, 365)
        created_at = (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d %H:%M:%S")

        property_data = {
            "id": property_id,
            "name": name_template,
            "image": image,
            "price": float(price),
            "duration": duration,
            "location": location,
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
            "size": size,
            "type": prop_type,
            "description": description,
            "amenities": amenities,
            "verified": verified,
            "owner_id": owner_id,
            "created_at": created_at,
            "updated_at": created_at
        }

        properties.append(property_data)
        property_id += 1

    return properties

def generate_events(count=50, user_count=250):
    """Generate community events"""
    events = []
    event_id = 1

    # Event types and templates
    event_types = {
        "Language Exchange": [
            "Italian-English Language Exchange",
            "Multilingual Coffee Meetup",
            "Spanish-Italian Conversation Night",
            "Language Learning Aperitivo"
        ],
        "Cultural": [
            "Museum Tour: Vatican Museums",
            "Historic Rome Walking Tour",
            "Italian Cooking Class",
            "Wine Tasting Evening",
            "Opera Night at Teatro dell'Opera",
            "Art Gallery Visit"
        ],
        "Social": [
            "Welcome Dinner for New Members",
            "Rooftop Aperitivo Party",
            "International Potluck Dinner",
            "Board Games Night",
            "Movie Night: Italian Cinema",
            "Picnic in Villa Borghese"
        ],
        "Sports": [
            "Sunday Football Match",
            "Cycling Tour: Via Appia Antica",
            "Yoga in the Park",
            "Running Club Meetup",
            "Beach Volleyball at Ostia"
        ],
        "Networking": [
            "Expat Networking Mixer",
            "Student Welcome Event",
            "Professional Networking Drinks",
            "Startup Meetup Rome",
            "Freelancer Coffee Meetup"
        ],
        "Special": [
            "Christmas Market Visit",
            "New Year's Eve Celebration",
            "Carnival Party",
            "Easter Brunch",
            "Summer BBQ Party",
            "Halloween Costume Party"
        ]
    }

    locations_events = [
        "Trastevere", "Monti", "Testaccio", "Centro Storico", "San Lorenzo",
        "Prati", "Pigneto", "Ostiense", "Villa Borghese", "Aventino",
        "Campo de' Fiori", "Piazza Navona", "Spanish Steps area"
    ]

    for i in range(count):
        # Select event type and name
        event_category = random.choice(list(event_types.keys()))
        event_title = random.choice(event_types[event_category])

        # Description
        descriptions = {
            "Language Exchange": "Practice Italian and meet international friends! All levels welcome. Bring your enthusiasm and willingness to learn!",
            "Cultural": "Explore Rome's incredible cultural heritage together. Expert guides and friendly atmosphere guaranteed!",
            "Social": "Meet fellow expats and students in a relaxed, friendly environment. Great food, drinks, and conversation!",
            "Sports": "Stay active and make friends! All skill levels welcome. Don't forget comfortable clothes!",
            "Networking": "Connect with professionals and students. Expand your network in Rome's international community!",
            "Special": "Celebrate with the RoomersAround community! Special occasion, special memories!"
        }

        description = descriptions[event_category]

        # Location
        location = f"{random.choice(locations_events)}, Rome"

        # Date (next 90 days)
        days_ahead = random.randint(1, 90)
        event_date = (datetime.now() + timedelta(days=days_ahead)).strftime("%Y-%m-%d %H:%M:%S")

        # Type and official status
        event_type = event_category
        is_official = random.choice([True, False, False])  # 33% official

        # Creator
        creator_id = random.randint(1, user_count)

        # Attendees
        max_attendees = random.choice([10, 15, 20, 25, 30, 50, None, None])  # Some unlimited
        if max_attendees:
            attendees = random.randint(1, min(max_attendees - 2, 15))
        else:
            attendees = random.randint(3, 30)

        # Created date
        created_days_ago = random.randint(1, 30)
        created_at = (datetime.now() - timedelta(days=created_days_ago)).strftime("%Y-%m-%d %H:%M:%S")

        event = {
            "id": event_id,
            "title": event_title,
            "description": description,
            "event_date": event_date,
            "location": location,
            "type": event_type,
            "creator_id": creator_id,
            "is_official": is_official,
            "attendees": attendees,
            "max_attendees": max_attendees,
            "created_at": created_at
        }

        events.append(event)
        event_id += 1

    return events

def generate_sql_inserts(users, properties, events):
    """Generate SQL INSERT statements"""
    sql_statements = []

    # Users table
    sql_statements.append("-- Users Table Inserts\n")
    for user in users:
        interests_str = "{" + ",".join([f'"{i}"' for i in user['interests']]) + "}"
        sql = f"""INSERT INTO users (id, name, avatar, profession, age, nationality, bio, interests, rating, verified, joined_date)
VALUES ({user['id']}, '{user['name'].replace("'", "''")}', '{user['avatar']}', '{user['profession']}', {user['age']}, '{user['nationality']}', '{user['bio'].replace("'", "''")}', '{interests_str}', {user['rating']}, {user['verified']}, '{user['joinedDate']}');"""
        sql_statements.append(sql)

    sql_statements.append("\n\n-- Properties Table Inserts\n")
    for prop in properties:
        amenities_str = "{" + ",".join([f'"{a}"' for a in prop['amenities']]) + "}"
        sql = f"""INSERT INTO properties (id, name, image, price, duration, location, bedrooms, bathrooms, size, type, description, amenities, verified, owner_id, created_at, updated_at)
VALUES ({prop['id']}, '{prop['name'].replace("'", "''")}', '{prop['image']}', {prop['price']}, '{prop['duration']}', '{prop['location']}', {prop['bedrooms']}, {prop['bathrooms']}, {prop['size']}, '{prop['type']}', '{prop['description'].replace("'", "''")}', '{amenities_str}', {prop['verified']}, {prop['owner_id']}, '{prop['created_at']}', '{prop['updated_at']}');"""
        sql_statements.append(sql)

    sql_statements.append("\n\n-- Events Table Inserts\n")
    for event in events:
        max_att = event['max_attendees'] if event['max_attendees'] else 'NULL'
        sql = f"""INSERT INTO events (id, title, description, event_date, location, type, creator_id, is_official, attendees, max_attendees, created_at)
VALUES ({event['id']}, '{event['title'].replace("'", "''")}', '{event['description'].replace("'", "''")}', '{event['event_date']}', '{event['location']}', '{event['type']}', {event['creator_id']}, {event['is_official']}, {event['attendees']}, {max_att}, '{event['created_at']}');"""
        sql_statements.append(sql)

    return "\n".join(sql_statements)

if __name__ == "__main__":
    print("🚀 Generating fake data for RoomersAround...\n")

    # Generate data
    print("👥 Generating 250+ users...")
    users = generate_users(250)
    print(f"   ✓ Generated {len(users)} international users")

    print("\n🏠 Generating 500+ properties...")
    properties = generate_properties(500, len(users))
    print(f"   ✓ Generated {len(properties)} properties across Italy")

    print("\n📅 Generating 50+ events...")
    events = generate_events(50, len(users))
    print(f"   ✓ Generated {len(events)} community events")

    # Save JSON files
    print("\n💾 Saving JSON files...")
    with open('fake_data_users.json', 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=2, ensure_ascii=False)
    print("   ✓ Saved fake_data_users.json")

    with open('fake_data_properties.json', 'w', encoding='utf-8') as f:
        json.dump(properties, f, indent=2, ensure_ascii=False)
    print("   ✓ Saved fake_data_properties.json")

    with open('fake_data_events.json', 'w', encoding='utf-8') as f:
        json.dump(events, f, indent=2, ensure_ascii=False)
    print("   ✓ Saved fake_data_events.json")

    # Save SQL file
    print("\n💾 Generating SQL insert statements...")
    sql_content = generate_sql_inserts(users, properties, events)
    with open('fake_data_inserts.sql', 'w', encoding='utf-8') as f:
        f.write("-- RoomersAround Fake Data SQL Inserts\n")
        f.write("-- Generated: " + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "\n\n")
        f.write(sql_content)
    print("   ✓ Saved fake_data_inserts.sql")

    # Generate summary
    print("\n" + "="*60)
    print("📊 SUMMARY")
    print("="*60)
    print(f"👥 Users: {len(users)}")
    print(f"   - Nationalities: {len(set([u['nationality'] for u in users]))}")
    print(f"   - Verified: {len([u for u in users if u['verified']])}")
    print(f"\n🏠 Properties: {len(properties)}")
    print(f"   - Cities: {len(set([p['location'].split(',')[1].strip() for p in properties]))}")
    print(f"   - Types: {len(set([p['type'] for p in properties]))}")
    print(f"   - Verified: {len([p for p in properties if p['verified']])}")
    print(f"   - Price range: €{min([p['price'] for p in properties])} - €{max([p['price'] for p in properties])}")
    print(f"\n📅 Events: {len(events)}")
    print(f"   - Types: {len(set([e['type'] for e in events]))}")
    print(f"   - Official: {len([e for e in events if e['is_official']])}")
    print("="*60)

    print("\n✨ All fake data generated successfully!")
    print("\n📁 Files created:")
    print("   - fake_data_users.json")
    print("   - fake_data_properties.json")
    print("   - fake_data_events.json")
    print("   - fake_data_inserts.sql")
    print("\n💡 You can import the SQL file directly into your database!")
