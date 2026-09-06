type CategoryFilterProps = {
  categories: string[]
  active: string
  onSelect: (category: string) => void
}

export function CategoryFilter({ categories, active, onSelect }: CategoryFilterProps) {
  return (
    <div className="filter-row">
      {categories.map((category) => (
        <button
          key={category}
          className={active === category ? 'filter active-filter' : 'filter'}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
