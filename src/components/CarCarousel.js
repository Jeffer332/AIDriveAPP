"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native"

const CarCarousel = ({ title, data, filters, defaultFilter }) => {
  const [filteredData, setFilteredData] = useState([])
  const [selectedFilter, setSelectedFilter] = useState(defaultFilter || filters[0].value)

  useEffect(() => {
    filterData(selectedFilter)
  }, [selectedFilter, data])

  const filterData = (filter) => {
    let filtered = [...data]

    switch (filter) {
      case "expensive":
        filtered = filtered.sort((a, b) => 
          parseFloat(b.Precio.replace(/[^\d.-]/g, "")) - parseFloat(a.Precio.replace(/[^\d.-]/g, ""))
        )
        break
      case "cheap":
        filtered = filtered.sort((a, b) => 
          parseFloat(a.Precio.replace(/[^\d.-]/g, "")) - parseFloat(b.Precio.replace(/[^\d.-]/g, ""))
        )
        break
      case "azuay":
      case "guayas":
      case "pichincha":
        filtered = filtered.filter((car) => car.Placa?.toLowerCase() === filter)
        break
    }

    setFilteredData(filtered.slice(0, 5))
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
              <Text style={styles.cardTitle}>{`${item.Marca || "N/A"} ${item.Modelo || "N/A"}`}</Text>
              <Text style={styles.cardSubtitle}>{`Placa: ${item.Placa || "N/A"}`}</Text>
              <Text style={styles.cardSubtitle}>{`Recorrido: ${item.Recorrido || "N/A"}`}</Text>
              <Text style={styles.cardPrice}>{item.Precio || "N/A"}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => item.id || index.toString()}
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