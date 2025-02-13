"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native"

const CarCarousel = ({ title, data, filters, defaultFilter }) => {
  const [filteredData, setFilteredData] = useState([])
  const [selectedFilter, setSelectedFilter] = useState(defaultFilter || filters[0].value)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (data && data.length > 0) {
      filterData(selectedFilter)
    }
  }, [data, selectedFilter])

  const filterData = (filter) => {
    setIsLoading(true)
    let filtered = data.filter(
      (car) =>
        car.Marca !== "N/A" &&
        car.Modelo !== "N/A" &&
        car.Placa !== "N/A" &&
        car.Recorrido !== "N/A" &&
        car.Precio !== "N/A" &&
        car.ImagenURL,
    )

    switch (filter) {
      case "expensive":
        filtered = filtered.sort(
          (a, b) =>
            Number.parseFloat(b.Precio.replace(/[^\d.-]/g, "")) - Number.parseFloat(a.Precio.replace(/[^\d.-]/g, "")),
        )
        break
      case "cheap":
        filtered = filtered.sort(
          (a, b) =>
            Number.parseFloat(a.Precio.replace(/[^\d.-]/g, "")) - Number.parseFloat(b.Precio.replace(/[^\d.-]/g, "")),
        )
        break
      case "guayas":
      case "pichincha":
        filtered = filtered.filter((car) => car.Placa.toLowerCase().includes(filter))
        break
      case "otro":
        filtered = filtered.filter(
          (car) => !["guayas", "pichincha"].some((province) => car.Placa.toLowerCase().includes(province)),
        )
        break
    }

    setFilteredData(filtered.slice(0, 5))
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.filterButtonContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[styles.filterButton, selectedFilter === filter.value && styles.selectedFilterButton]}
            onPress={() => setSelectedFilter(filter.value)}
          >
            <Text style={styles.filterButtonText}>{filter.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.ImagenURL }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{`${item.Marca} ${item.Modelo}`}</Text>
              <Text style={styles.cardSubtitle}>{`Placa: ${item.Placa}`}</Text>
              <Text style={styles.cardSubtitle}>{`Recorrido: ${item.Recorrido}`}</Text>
              <Text style={styles.cardPrice}>{item.Precio}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterButtonContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: "#191A2E",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedFilterButton: {
    backgroundColor: "#28a745",
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    width: 300,
    marginRight: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28a745",
    marginTop: 5,
  },
})

export default CarCarousel

